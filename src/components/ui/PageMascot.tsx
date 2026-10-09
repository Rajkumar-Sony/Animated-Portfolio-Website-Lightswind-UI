import { Mascot } from "page-mascot";
import { cn } from "@/lib/cn";

type PageMascotProps = {
  className?: string;
  size?: number;
};

export function PageMascot({ className, size = 132 }: PageMascotProps) {
  return (
    <div
      className={cn("pointer-events-auto grid shrink-0 place-items-center", className)}
    >
      <Mascot
        directions="/mascots/raj-directions.png"
        reactions="/mascots/raj-reactions.png"
        size={size}
        className="[&>span]:scale-[0.82]"
        label="Raj mascot"
      />
    </div>
  );
}
