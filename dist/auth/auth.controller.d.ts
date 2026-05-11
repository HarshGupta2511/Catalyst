import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: {
        name: string;
        email: string;
        password: string;
        designation: string;
        department: string;
        phone?: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            designation: string;
            department: string;
            role: string;
        };
    }>;
    refresh(body: {
        refreshToken: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getMe(req: any): Promise<{
        id: string;
        email: string;
        name: string;
        designation: string;
        department: string;
        role: string;
        phone: string | null;
        isProjectLead: boolean;
        createdAt: Date;
    }>;
}
