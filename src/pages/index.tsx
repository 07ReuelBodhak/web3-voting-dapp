import Header from "@/components/Header";
import Voting from "@/components/Voting";

export default function Home() {
  return (
    <div className="flex gap-4 lg:px-20 overflow-hidden px-4 py-7 flex-col min-h-screen">
      <Header />
      <Voting />
    </div>
  );
}
