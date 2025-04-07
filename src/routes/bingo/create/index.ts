
export type ValidationFunc = (value: string) => string | undefined

export function createValidateEmailFunc(existingEmails: string[]): ValidationFunc {
    return (value) => {
        console.log("Validate", value, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value))
        if (existingEmails.includes(value)) return "Provided email already exists"
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) return "Invalid email format"
    }
}

export function generateSeed(): number {
    return Math.floor(Math.random() * 100000);
}