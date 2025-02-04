interface Props {
  children: React.ReactNode;
}

export default function CoordinatorLayout({ children }: Props) {
  return (
    <>
      {/* Header goes here */}
      {children}
    </>
  );
}
