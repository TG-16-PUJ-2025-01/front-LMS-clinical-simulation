interface Props {
  children: React.ReactNode;
}

export default function StudentLayout({ children }: Props) {
  return (
    <>
      {/* Header goes here */}
      {children}
    </>
  );
}
