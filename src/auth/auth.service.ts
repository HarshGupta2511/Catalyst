import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // REGISTER
  async register(data: {
    name: string;
    email: string;
    password: string;
    designation: string;
    department: string;
    phone?: string;
  }) {
    // Check if email already exists
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Save user to database
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        designation: data.designation,
        department: data.department,
        phone: data.phone,
        role: 'Employee',
      },
    });

    // Return tokens
    return this.generateTokens(user.id, user.email, user.role);
  }

  // LOGIN
  async login(email: string, password: string) {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Return tokens
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        designation: user.designation,
        department: user.department,
        role: user.role,
      },
      ...this.generateTokens(user.id, user.email, user.role),
    };
  }

  // GET CURRENT USER
  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        designation: true,
        department: true,
        role: true,
        phone: true,
        isProjectLead: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  // GENERATE JWT TOKENS
  private generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  // VERIFY REFRESH TOKEN
  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateTokens(user.id, user.email, user.role);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}