"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchInput } from "@/components/ui/search-input";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const FulltextSearch = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = async () => {
    router.push(`/fulltext-search?q=${search}`);
    setSearch("");
  };

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <form onSubmit={handleSearch}>
        <SearchInput
          type="text"
          placeholder={"Digite para pesquisar..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
    </div>
  );
};

export default FulltextSearch;
