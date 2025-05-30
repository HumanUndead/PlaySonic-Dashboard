import { useState } from "react";
import { CustomKTIcon } from "../../../presentation/components";

const SearchInner = () => {
  const [search, setSearch] = useState<string>("");
  return (
    <div
      data-kt-search-element="content"
      data-kt-menu="true"
      className="menu menu-sub menu-sub-dropdown p-7 w-325px w-md-375px"
    >
      <div data-kt-search-element="wrapper">
        <form
          data-kt-search-element="form"
          className="w-100 position-relative mb-3"
          autoComplete="off"
        >
          <CustomKTIcon
            iconName="magnifier"
            className="fs-2 text-lg-1 text-gray-500 position-absolute top-50 translate-middle-y ms-0"
          />
          <input
            type="text"
            className="form-control form-control-flush ps-10"
            name="search"
            value={search}
            placeholder="Search..."
            data-kt-search-element="input"
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
};

export { SearchInner };
