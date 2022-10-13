/// <reference types="cypress" />
const answer_qs = (q = 0) => {
  it(`answers question ${q}`, () => {
    cy.get("body")
      .then(async ($body) => {
        if ($body.find("input[type='radio'][name='answer']").length > 0) {
          $body.find("input[type='radio'][name='answer']")[0].click();
        } else if ($body.find("input[name='answer']").length > 0) {
          await cy.get("input[name='answer']").type("42");
        }
        return $body;
      })
      .then(($body) => {
        if ($body.find("[data-click-on-key='n']").length > 0)
          $body.find("[data-click-on-key='n']")[0].click();
        else done = true;
      })
  });
  if (q < 32) answer_qs(q + 1);
};

describe("CIS-R", () => {
  it("shows a welcome screen", () => {
    cy.visit("http://localhost:5173/");
    // We use the `cy.get()` command to get all elements that match the selector.
    // Then, we use `should` to assert that there are two matched items,
    // which are the two default items.
    cy.get("header").should("have.text", "Welcome to the CIS-R");

    cy.get("button").should("include.text", "Begin").click();
  });

  answer_qs();

  it("shows the debrief screen", () => {
    cy.get("body").should("include.text", "Thank you");
  });
});
