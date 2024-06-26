import { Model } from "@/core/interfaces/model.interface";
import { ContactNumberTypes } from "@/core/enums/contact_number_types.enum";
import { DocumentSnapshot, SnapshotOptions } from "firebase/firestore";
import { UserContactNumber } from "@/types/firebase/user/user_contact_number";
import Utilities from "@/lib/utils";

export default class UserContactNumberModel implements Model {
    // * FIELDS
    private _uuid: string;
    private _phoneNumber: string;
    private _userRef: string;
    private _type: ContactNumberTypes;
    private _isPrimary: boolean;
    private _isVerified: boolean;
    private _isPublic: boolean;

    // METADATA FIELDS
    private _addedAt: Date;
    private _addedByRef: string;
    private _updatedAt: Date;
    private _updatedByRef: string;
    private _deletedAt: Date | null;
    private _deletedByRef: string | null;

    // * CONSTRUCTOR
    constructor({
        uuid,
        phoneNumber,
        userRef,
        type,
        isPrimary = true,
        isVerified = false,
        isPublic = true,
        addedAt,
        addedByRef,
        updatedAt,
        updatedByRef,
        deletedAt = null,
        deletedByRef = null
    }: {
        uuid: string,
        phoneNumber: string,
        userRef: string,
        type: ContactNumberTypes,
        isPrimary?: boolean,
        isVerified?: boolean,
        isPublic?: boolean,
        addedAt: Date,
        addedByRef: string,
        updatedAt: Date,
        updatedByRef: string,
        deletedAt?: Date | null,
        deletedByRef?: string | null
    }) {
        this._uuid = uuid;
        this._phoneNumber = phoneNumber;
        this._userRef = userRef;
        this._type = type;
        this._isPrimary = isPrimary;
        this._isVerified = isVerified;
        this._isPublic = isPublic;
        this._addedAt = addedAt;
        this._addedByRef = addedByRef;
        this._updatedAt = updatedAt;
        this._updatedByRef = updatedByRef;
        this._deletedAt = deletedAt;
        this._deletedByRef = deletedByRef;
    };

    // * GETTERS
    get uuid(): string { return this._uuid; }
    get phoneNumber(): string { return this._phoneNumber; }
    get userRef(): string { return this._userRef; }
    get type(): ContactNumberTypes { return this._type; }
    get isPrimary(): boolean { return this._isPrimary; }
    get isVerified(): boolean { return this._isVerified; }
    get isPublic(): boolean { return this._isPublic; }
    get addedAt(): Date { return this._addedAt; }
    get addedByRef(): string { return this._addedByRef; }
    get updatedAt(): Date { return this._updatedAt; }
    get updatedByRef(): string { return this._updatedByRef; }
    get deletedAt(): Date | null { return this._deletedAt; }
    get deletedByRef(): string | null { return this._deletedByRef; }

    // * UTILITIES
    public copyWith<UserContactNumberModel>({
        uuid,
        phoneNumber,
        userRef,
        type,
        isPrimary,
        isVerified,
        isPublic,
        addedAt,
        addedByRef,
        updatedAt,
        updatedByRef,
        deletedAt,
        deletedByRef
    }: {
        uuid?: string,
        phoneNumber?: string,
        userRef?: string,
        type?: ContactNumberTypes,
        isPrimary?: boolean,
        isVerified?: boolean,
        isPublic?: boolean,
        addedAt?: Date,
        addedByRef?: string,
        updatedAt?: Date,
        updatedByRef?: string,
        deletedAt?: Date | null,
        deletedByRef?: string | null
    }): UserContactNumberModel {
        return new UserContactNumberModel({
            uuid: uuid ?? this.uuid,
            phoneNumber: phoneNumber ?? this.phoneNumber,
            userRef: userRef ?? this.userRef,
            type: type ?? this.type,
            isPrimary: isPrimary ?? this.isPrimary,
            isVerified: isVerified ?? this.isVerified,
            isPublic: isPublic ?? this.isPublic,
            addedAt: addedAt ?? this.addedAt,
            addedByRef: addedByRef ?? this.addedByRef,
            updatedAt: updatedAt ?? this.updatedAt,
            updatedByRef: updatedByRef ?? this.updatedByRef,
            deletedAt: deletedAt ?? this.deletedAt,
            deletedByRef: deletedByRef ?? this.deletedByRef
        }) as UserContactNumberModel;
    }

    public fromFirestore<UserContactNumberModel>({ snapshot, options }: {
        snapshot: DocumentSnapshot, options?: SnapshotOptions
    }): UserContactNumberModel {
        const data = snapshot.data(options) as UserContactNumber;

        return new UserContactNumberModel({
            uuid: data.uuid,
            phoneNumber: data.phoneNumber,
            userRef: data.userRef,
            type: Utilities.stringToContactNumberTypesEnum(data.type),
            isPrimary: data.isPrimary,
            isVerified: data.isVerified,
            isPublic: data.isPublic,
            addedAt: data.addedAt,
            addedByRef: data.addedByRef,
            updatedAt: data.updatedAt,
            updatedByRef: data.updatedByRef,
            deletedAt: data.deletedAt,
            deletedByRef: data.deletedByRef
        }) as UserContactNumberModel;
    }

    public toFirestore(): UserContactNumber {
        return {
            uuid: this.uuid,
            phoneNumber: this.phoneNumber,
            userRef: this.userRef,
            type: this.type,
            isPrimary: this.isPrimary,
            isVerified: this.isVerified,
            isPublic: this.isPublic,
            addedAt: this.addedAt,
            addedByRef: this.addedByRef,
            updatedAt: this.updatedAt,
            updatedByRef: this.updatedByRef,
            deletedAt: this.deletedAt,
            deletedByRef: this.deletedByRef
        };
    }
}
