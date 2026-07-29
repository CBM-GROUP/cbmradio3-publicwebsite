export interface Team {
    id: number;
    name: string;
    role: string;
    bio: string;
    photo: string;
    email: string;
    phone: string;
    social: {
        facebook: string;
        twitter: string;
        instagram: string;
    }
    is_active: boolean;
}