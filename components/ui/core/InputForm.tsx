import React, { ReactNode } from "react";

interface props {
  children: ReactNode;
}

export default function InputForm({ children }: props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  );
}
