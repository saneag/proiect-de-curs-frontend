export interface IFormikFieldsProps {
    value: string;
    placeholder?: string;
    type?: string;
    errors?: Record<string, string>;
    touched?: Record<string, boolean>;
    disabled?: boolean;
}
