export interface TeamMember {
    id?: number;
    name: string;
    role: string;
    bio: string;
    photo?: string | null;
    email: string;
    phone: string;
    social: {
        facebook: string;
        twitter: string;
        instagram: string;
    }
    is_active: boolean;
    order: number;
}