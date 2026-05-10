// ? Components
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export const Field = ({
  title,
  value,
  setValue,
  type = "text",
}: {
  title: string;
  value: string;
  setValue: (val: string) => void;
  type?: "text" | "password" | "email";
}) => {
  return (
    <div>
      <p className="text-xs">{title}</p>
      <Input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export const FormField = ({
  label,
  value,
  onChange,
  type = "text",
  variant = "input",
}: {
  label: string;
  value: string | number | boolean;
  onChange: (value: any) => void;
  type?: "text" | "number";
  variant?: "input" | "checkbox";
}) => {
  return (
    <div>
      <label className="block text-xs mb-1">{label}</label>
      {variant === "input" ? (
        <Input
          type={type}
          placeholder={label}
          value={value as string | number}
          onChange={onChange}
        />
      ) : (
        <Checkbox checked={value as boolean} onCheckedChange={onChange} />
      )}
    </div>
  );
};
