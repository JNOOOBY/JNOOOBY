type SignatureProps = {
  text?: string;
  tone?: 'light' | 'dark';
  className?: string;
};

export default function Signature({
  text = 'أبو تيم',
  tone = 'light',
  className = '',
}: SignatureProps) {
  return (
    <p
      className={`signature text-center ${
        tone === 'dark' ? 'text-slate-300' : 'text-slate-600'
      } ${className}`}
      aria-label="التوقيع"
    >
      {text}
    </p>
  );
}
