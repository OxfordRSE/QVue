/// <reference types="cypress" />
const answer_qs = (q = 0) => {
  it(`answers question ${q}`, () => {
    cy.get("body")
      .then(async ($body) => {
        if ($body.find(".answer-wrapper input[type='radio']").length > 0) {
          $body.find(".answer-wrapper input[type='radio']")[0].click();
        } else if ($body.find(".answer-wrapper input").length > 0) {
          await cy.get(".answer-wrapper input").type("42");
        }
        return $body;
      })
      .then(($body) => {
        if ($body.find("[data-nav-direction='next']").length > 0)
          $body.find("[data-nav-direction='next']")[0].click();
      });
  });
  if (q < 32) answer_qs(q + 1);
};

describe("CIS-R", () => {
  it("shows a welcome screen", () => {
    cy.visit('/run/cis-r')
    cy.get("h2").should("include.text", "About the tool");

    cy.get("button").should("include.text", "Begin").click();
  });

  answer_qs();

  it("shows the debrief screen", () => {
    cy.get("body").should("include.text", "Thank you");
  });
});
