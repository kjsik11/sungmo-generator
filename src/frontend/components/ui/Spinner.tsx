import cn from 'classnames';

interface Props {
  className?: string;
}

export default function Spinner({ className }: Props) {
  return (
    <div className={cn(className, 'flex justify-center items-center')}>
      <svg
        className="w-6 h-6 animate-spin"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity="0.25" strokeWidth="4" />
        <path
          d="M12 2C6.47715 2 2 6.47715 2 12C2 14.5361 2.94409 16.8517 4.5 18.6146"
          stroke="currentColor"
          strokeOpacity="0.75"
          strokeWidth="4"
        />
      </svg>
    </div>
  );
}
