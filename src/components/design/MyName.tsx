import { MyEnName } from '@/components/MyEnName';

export function MyName({ className }: { className?: string }) {
  return (
  <>
    <h1 className="sr-only">Rashad Hussein - رشاد حسين</h1>
    <h2 className="sr-only">Web Developer - مطور ويب</h2>
    <MyEnName id="svg-my-en-name" className={className} />
  </>
  );
}
