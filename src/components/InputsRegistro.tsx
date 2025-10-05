// Ejemplo de componente reutilizable
interface InputWithValidationProps {
  id: string;
  label: string;
  type?: string;
  name: string;
  value: string;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validationClass: string;
  validationMessage?: React.ReactNode;
  children?: React.ReactNode; // Para íconos de visibilidad, etc.
}

export const InputWithValidation: React.FC<InputWithValidationProps> = ({
  id, label, type = "text", name, value, placeholder, maxLength, required,
  onChange, validationClass, validationMessage, children
}) => (
  <div className="mb-3 position-relative">
    <label htmlFor={id} className="form-label text-light">{label}</label>
    <input
      type={type}
      className={`form-control ${validationClass}`}
      id={id}
      name={name}
      placeholder={placeholder}
      maxLength={maxLength}
      required={required}
      value={value}
      onChange={onChange}
    />
    {children}
    {validationMessage}
  </div>
);

interface PasswordInputProps extends Omit<InputWithValidationProps, 'type'> {
  show: boolean;
  onToggle: () => void;
}

export const PasswordInput: React.FC<PasswordInputProps> = (props) => (
  <InputWithValidation
    {...props}
    type={props.show ? "text" : "password"}
  >
    <i
      className={`bi ${props.show ? "bi-eye-slash-fill" : "bi-eye-fill"} toggle-password`}
      onClick={props.onToggle}
      style={{ position: 'absolute', right: '10px', top: '38px', cursor: 'pointer', color: 'black' }}
    ></i>
  </InputWithValidation>
);