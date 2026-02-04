const sortProducts = require("../../util/sort-products");

describe("sortProducts", () => {
  const unsortedProducts = [
    { name: "Drumsticks", price: 10, rating: 3 },
    { name: "Strings", price: 5, rating: 5 },
    { name: "Picks", price: 3, rating: 1 },
  ];
  //name --> alphebetically
  it("sorts products by name alphebetically", () => {
    const expectedSorting = [
      { name: "Drumsticks", price: 10, rating: 3 },
      { name: "Picks", price: 3, rating: 1 },
      { name: "Strings", price: 5, rating: 5 },
    ];

    const actualSorting = sortProducts(unsortedProducts, "nameAsc");

    expect(actualSorting).toEqual(expectedSorting);
  });

  //price --> ascending
  it("sorts products by price ascending", () => {
    const expectedSorting = [
      { name: "Picks", price: 3, rating: 1 },
      { name: "Strings", price: 5, rating: 5 },
      { name: "Drumsticks", price: 10, rating: 3 },
    ];

    const actualSorting = sortProducts(unsortedProducts, "priceAsc");

    expect(actualSorting).toEqual(expectedSorting);
  });

  //rating --> descending
  it("sorts products by rating decending", () => {
    const expectedSorting = [
      { name: "Strings", price: 5, rating: 5 },
      { name: "Drumsticks", price: 10, rating: 3 },
      { name: "Picks", price: 3, rating: 1 },
    ];

    const actualSorting = sortProducts(unsortedProducts, "ratingDsc");

    expect(actualSorting).toEqual(expectedSorting);
  });
});
