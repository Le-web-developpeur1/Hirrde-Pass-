export interface Scanner {
    id: string;
    nom: string;
    name?: string;
    email: string;
    phoneNumber: string;
    role: string;
    isActive: boolean;
    eventAssigned?: string;
}

export type RootStackParams = {
    Onboarding: undefined;
    Login: undefined;
    VerifyCode: {
        phoneNumber: string;
        scanner: Scanner;
    };
    Scanner: undefined;
};