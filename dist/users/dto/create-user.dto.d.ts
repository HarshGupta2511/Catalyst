export declare enum Department {
    Software = "Software",
    Design = "Design",
    Engineering = "Engineering",
    Procurement = "Procurement",
    FlightOps = "Flight Ops",
    Production = "Production",
    Store = "Store",
    Finance = "Finance"
}
export declare enum Role {
    Employee = "Employee",
    ProductLead = "Product Lead",
    DepartmentHead = "Department Head",
    CEO = "CEO",
    Admin = "Admin"
}
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    designation: string;
    department: Department;
    role?: Role;
    phone?: string;
}
