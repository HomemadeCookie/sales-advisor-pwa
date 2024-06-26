import AuthException from "@/core/exceptions/auth_exception";
import { Either } from "@/core/types/either";
import { FirebaseError } from "firebase/app";
import {
    Auth,
    createUserWithEmailAndPassword,
    deleteUser,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    User,
    UserCredential
} from "firebase/auth";

/**
 * A Singleton class that provides authentication services.
 */
export default class AuthService {
    // * FIELDS
    // eslint-disable-next-line no-use-before-define
    private static instance: AuthService | null = null;
    private _authProvider: Auth;

    // * CONSTRUCTOR
    private constructor({ authProvider }: { authProvider: Auth }) {
        this._authProvider = authProvider;
    }

    static getInstance({ authProvider }: { authProvider: Auth }): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService({ authProvider });
        }

        return AuthService.instance;
    }

    // * UTILITIES
    public async createUserWithEmailAndPassword({ email, password }: {
        email: string, password: string
    }): Promise<Either<AuthException, UserCredential>> {
        try {
            const userCredential: UserCredential = await createUserWithEmailAndPassword(
                this._authProvider, email, password
            );

            return { right: userCredential };
        } catch (error: any) {
            const _error = error as FirebaseError;
            const authException = new AuthException({
                code: _error.code,
                message: _error.message,
                stackTrace: _error.stack || null
            });

            return { left: authException };
        }
    }

    public async signInWithEmailAndPassword({ email, password }: {
        email: string, password: string
    }): Promise<Either<AuthException, UserCredential>> {
        try {
            const userCredential: UserCredential = await signInWithEmailAndPassword(
                this._authProvider, email, password
            );

            return { right: userCredential };
        } catch (error: any) {
            const _error = error as FirebaseError;
            const authException = new AuthException({
                code: _error.code,
                message: _error.message,
                stackTrace: _error.stack || null
            });

            return { left: authException }
        }
    }

    public async sendEmailVerification(user: User): Promise<Either<AuthException, null>> {
        try {
            await sendEmailVerification(user);
            return { right: null };
        } catch (error: any) {
            const _error = error as FirebaseError;
            const authException = new AuthException({
                code: _error.code,
                message: _error.message,
                stackTrace: _error.stack || null
            });

            return { left: authException };
        }
    }

    public async sendPasswordResetEmail(email: string): Promise<Either<AuthException, null>> {
        try {
            await sendPasswordResetEmail(this._authProvider, email);
            return { right: null };
        } catch (error: any) {
            const _error = error as FirebaseError;
            const authException = new AuthException({
                code: _error.code,
                message: _error.message,
                stackTrace: _error.stack || null
            });

            return { left: authException };
        }
    }

    public async signOut(): Promise<Either<AuthException, null>> {
        try {
            await this._authProvider.signOut();
            return { right: null };
        } catch (error: any) {
            const _error = error as FirebaseError;
            const authException = new AuthException({
                code: _error.code,
                message: _error.message,
                stackTrace: _error.stack || null
            });

            return { left: authException };
        }
    }

    // public onAuthStateChanged(callback: (user: UserCredential | null) => void): void {
    //     this.authProvider.onAuthStateChanged(callback);
    // }

    public getCurrentUser(): Either<AuthException, User> {
        const user: User | null = this._authProvider.currentUser;
        if (user) {
            return { right: user };
        } else {
            const authException = new AuthException({
                code: "auth/user-not-found",
                message: "No user is currently signed in.",
                stackTrace: null
            });

            return { left: authException };
        }
    }

    /**
     * Deletes and signs out the current user.
     */
    public async deleteUser(user: User): Promise<Either<AuthException, null>> {
        try {
            await deleteUser(user);
            return { right: null };
        } catch (error: any) {
            const _error = error as FirebaseError;
            const authException = new AuthException({
                code: _error.code,
                message: _error.message,
                stackTrace: _error.stack || null
            });

            return { left: authException };
        }
    }


    // public async reauthenticateUser(user: User): Promise<Either<AuthException, UserCredential>> {
    //     // TODO: prompt the user to re-provide their sign-in credentials
    //     const credential = promptForCredentials();

    //     try {
    //         const newUserCredential: UserCredential = await reauthenticateWithCredential(
    //             user, credential
    //         );

    //         return { right: newUserCredential };
    //     } catch (error: any) {
    //         const _error = error as FirebaseError;
    //         const authException = new AuthException({
    //             code: _error.code,
    //             message: _error.message,
    //             stackTrace: _error.stack || null
    //         });

    //         return { left: authException };
    //     }
    // }

    /**
     * Reloads the current user, if signed in.
     */
    public async reloadUser(): Promise<Either<AuthException, User>> {
        let user: User;
        if ('right' in this.getCurrentUser()) {
            user = (this.getCurrentUser() as { right: User }).right;
        } else {
            return {
                left: (this.getCurrentUser() as { left: AuthException }).left
            };
        }

        try {
            await user.reload();
            return { right: user };
        } catch (error: any) {
            const _error = error as FirebaseError;
            const authException = new AuthException({
                code: _error.code,
                message: _error.message,
                stackTrace: _error.stack || null
            });

            return { left: authException };
        }
    }

    // TODO: [p1] Implement utility methods for:
    // 1. updating user data object that is bound to the user in auth service.
    // 2. Real-time user data updates.
    // 3. User data persistence.
    // 4. User data synchronization
    // 5. User data validation.
}