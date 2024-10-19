export function AppContainer({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto my-16 w-full max-w-7xl flex-1 px-6">
      {children}
    </main>
  );
}

export function AppContainerFull({ children }: { children: React.ReactNode }) {
  return <main className="w-full flex-1">{children}</main>;
}

export function AppContainerCompact({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto my-16 w-full max-w-3xl flex-1 px-6">
      {children}
    </main>
  );
}

export function AppContainerProse({ children }: { children: React.ReactNode }) {
  return (
    <main className="prose prose-sm mx-auto my-16 w-full px-6 dark:prose-invert md:prose-base">
      {children}
    </main>
  );
}

export function AppContainerCenter({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto my-16 flex flex-1 items-center justify-center px-6">
      {children}
    </main>
  );
}
