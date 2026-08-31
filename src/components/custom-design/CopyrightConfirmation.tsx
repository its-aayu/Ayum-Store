import { Link } from 'react-router-dom';

type CopyrightConfirmationProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
};

export function CopyrightConfirmation({ checked, onChange, error }: CopyrightConfirmationProps) {
  return (
    <div>
      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink/30 text-brand-primary focus-visible:outline-brand-primary"
          aria-invalid={Boolean(error)}
        />
        <span className="text-ink">
          I confirm that I have the necessary rights or permission to use and print this design. I have read the{' '}
          <Link to="/custom-design-policy" className="font-medium text-brand-primary hover:underline" target="_blank">
            Custom Design & Copyright Policy
          </Link>
          .
        </span>
      </label>
      {error && (
        <p className="mt-1.5 text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
