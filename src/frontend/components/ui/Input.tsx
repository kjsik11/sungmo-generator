import { XIcon } from '@heroicons/react/outline';
import cn from 'classnames';
import { HTMLAttributes, InputHTMLAttributes, useRef } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  containerClassName?: string;
  containerProps?: HTMLAttributes<HTMLDivElement>;
  label?: string;
  message?: string;
  error?: boolean;
  color?: 'sky';
  clear?: () => void;
  required?: boolean;
  isBgWhite?: boolean;
}

const colorClasses = {
  sky: 'border-gray-300 focus:ring-sky-400 focus:border-sky-400',
};

export default function Input({
  className,
  containerClassName,
  containerProps,
  label,
  message,
  error = false,
  color = 'sky',
  clear,
  required = false,
  name,
  type,
  value,
  isBgWhite = false,
  ...props
}: Props) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className={cn(containerClassName, 'relative text-left')} {...containerProps}>
      {label !== undefined && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 lg:text-base">
          <span>{label}</span>
          {required && (
            <span className="ml-1 text-sm text-cox500 absolute translate-x-1 translate-y-0.5">
              *
            </span>
          )}
        </label>
      )}
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          ref={ref}
          type={type ?? 'text'}
          name={name}
          className={cn(
            className,
            'block w-full pr-10 focus:outline-none text-base rounded-md',
            {
              [colorClasses[color]]: !error,
              'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500':
                error,
            },
            {
              'disabled:bg-gray-100': !isBgWhite,
              'disabled:bg-white': isBgWhite,
            },
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={name && error ? `${name}-error` : undefined}
          value={value}
          {...props}
        />
        {error && type !== 'password' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        {type === 'password' && value && (
          <button
            type="button"
            tabIndex={-1}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={(e) => {
              e.preventDefault();
              if (clear) clear();
            }}
          >
            <XIcon
              className={cn('w-5 h-5', {
                'text-red-500': error,
              })}
            />
          </button>
        )}
      </div>
      {message !== undefined && (
        <p
          className={cn('mt-2 text-sm font-medium', {
            'text-gray-500': !error,
            'text-red-400': error,
          })}
          id={name && error ? `${name}-error` : undefined}
        >
          {message}
        </p>
      )}
    </div>
  );
}
