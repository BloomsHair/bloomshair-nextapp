/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { FaSearch } from "react-icons/fa";
import useOutsideClick from "../hooks/useOutsideClick";
import _ from "lodash";
import AutoComplete from "./AutoComplete";
import { NEXT_URL } from "../config";

const SearchBox = () => {
  const router = useRouter();
  const { ref: documentRef, isVisible, setIsVisible } = useOutsideClick();
  const [suggestions, setSuggestions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [keyword, setKeyword] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    ref.current = _.debounce(processRequest, 300);
  }, []);

  async function processRequest(searchValue) {
    const res = await fetch(`${NEXT_URL}/api/products/allProducts`);
    const data = await res.json();
    const productNames = data.map((product) => product.name);
    const result = productNames.filter((product) =>
      product.toLowerCase().includes(searchValue.toLowerCase())
    );
    setSuggestions(result);
    if (result.length > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    const { value } = event.target;
    setKeyword(value);
    ref.current(value);
  }

  function handleSuggestionClick(value) {
    setSelectedProduct(value);
    setIsVisible(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsVisible(false);
    router.push(`/products/search?keyword=${selectedProduct}`);
    setKeyword("");
  };
  return (
    <div className="flex w-full max-w-screen-lg flex-col gap-1 shadow-2xl rounded-2xl">
      <form onSubmit={handleSubmit} className="flex w-full max-w-screen-lg">
        <div className="flex justify-start items-center w-full px-2 py-1 rounded-2xl bg-white border-none  focus:outline-none">
          <div className="flex flex-col w-full">
            <div>
              <input
                type="text"
                name="q"
                value={keyword}
                onChange={handleSearch}
                autoComplete="off"
                placeholder="Search Products..."
                className="w-full p-2  bg-white focus:outline-none border-none focus:shadow-none focus:ring-0"
              />
            </div>
          </div>
          <button type="submit">
            <FaSearch fontSize={21} className="ml-2 text-gray-900" />
          </button>
        </div>
      </form>
      <div ref={documentRef}>
        {isVisible && (
          <AutoComplete
            isVisible={isVisible}
            suggestions={suggestions}
            handleSuggestionClick={handleSuggestionClick}
          />
        )}
      </div>
    </div>
  );
};

export default SearchBox;
