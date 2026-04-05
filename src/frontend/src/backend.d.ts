import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ContactSubmission {
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
    phone: string;
}
export type ProjectId = bigint;
export type ContactId = bigint;
export interface Project {
    title: string;
    completedPercentage: bigint;
    forRentUnits: bigint;
    ongoingPercentage: bigint;
    imageUrl: string;
    location: string;
    forSaleUnits: bigint;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProject(project: Project): Promise<ProjectId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteContactSubmission(id: ContactId): Promise<void>;
    deleteProject(id: ProjectId): Promise<void>;
    editProject(id: ProjectId, project: Project): Promise<void>;
    getAllContactSubmissions(): Promise<Array<[ContactId, ContactSubmission]>>;
    getAllProjects(): Promise<Array<[ProjectId, Project]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProject(id: ProjectId): Promise<Project>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitContact(name: string, email: string, phone: string, message: string): Promise<ContactId>;
}
