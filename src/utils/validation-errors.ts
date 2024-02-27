import { FormNameSplit } from "./utils";

export class ValidationErrorState {
    private markedErrors: Record<string, any>

    private constructedSubValidation: Record<string, ValidationErrorState>

    private constructor(
        private validationErrors: Record<string, any>
    ) {
        this.markAllErrorsAsUnused();
    }

    public markAllErrorsAsUnused(): void {
        this.markedErrors = {};
        this.constructedSubValidation = {};
    }

    public markError(formName: string): void {
        const split = formName.split(new FormNameSplit());
        const sub = this.getSubValidation(split[0]);
        if (sub !== null || split.length < 2) {
            this.markedErrors[split[0]] = true;
            return;
        }
        if (sub instanceof ValidationErrorState) {
            sub.markError(split.slice(1).join(']['))
        }
    }

    public getUnmappedValidationErrors(): Array<[string, ValidationErrorState | null]>
    {
        return Object.entries(this.validationErrors).filter((error: [string, any]) => {
            return !this.markedErrors[error[0]] && String(error[0]).length > 0;
        }).map((error: [string, any]) => {
            return [error[0], this.getSubValidation(error[0])];
        });
    }

    public getSubValidation(key: string): ValidationErrorState | null
    {
        const state = this.validationErrors[key];
        if (typeof state === 'string') {
            return ValidationErrorState.createFrom(state);
        }
        if (state === null || state === undefined) {
            return null;
        }
        if (!this.constructedSubValidation[key]) {
            this.constructedSubValidation[key] = ValidationErrorState.createFrom(state);
        }

        return this.constructedSubValidation[key];
    }

    public static createFrom(object: undefined|null|string|Record<string, any>): ValidationErrorState {
        if (object === undefined || object === null) {
            return new ValidationErrorState({});
        }
        if (typeof object === 'string') {
            return new ValidationErrorState({'': object});
        }
        return new ValidationErrorState(object);
    }

    public getCurrentError(): string | null
    {
        return this.validationErrors[''] ? String(this.validationErrors['']) : null;
    }
}
