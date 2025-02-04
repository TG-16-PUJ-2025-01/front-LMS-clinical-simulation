interface Props {
  children: React.ReactNode;
}

export default function TeacherLayout({ children }: Props) {
  return (
    <>
      {/* Header goes here */}
      {children}
    </>
  );
}
