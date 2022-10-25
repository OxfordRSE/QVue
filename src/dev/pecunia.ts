import {
  AnswerType,
  Item,
  Questionnaire,
  type QuestionnaireProperties,
} from "questionnaire-core";

export * from "questionnaire-core";

export const _state_properties: QuestionnaireProperties = {
  items: [
    new Item({
      id: "H1.4",
      question:
        "In addition to the expenses for the goods and services already mentioned in this questionnaire, what other expenses have you or your family incurred because of your health in the past 3 months?\n" +
        "Please estimate your total expenses over the past three months.\n" +
        "Please only consider private expenses that were paid for using your own funds and where you have not been and will not be reimbursed.\n",
      answers: [
        {
          label: "Refurbishment of your home because of your health",
          type: AnswerType.NUMBER,
        },
        {
          label:
            "Change of your residence/living arrangements or change to your type of accommodation (such as moving from an independent house in the community to an institutional care setting) because of your health. Please consider all relevant costs",
          type: AnswerType.NUMBER,
        },
        {
          label:
            "Cancelling or postponing your holiday because of your health. Please consider all relevant costs",
          type: AnswerType.NUMBER,
        },
        {
          label:
            "Informal carer’s hotel costs when they accompany you when you travel, or the cost of respite care when those normally assisting you are away or otherwise unavailable",
          type: AnswerType.NUMBER,
        },
        {
          label: "Over-the-counter medication",
          type: AnswerType.NUMBER,
        },
        {
          label: "Therapeutic pets (e.g. guide dog)",
          type: AnswerType.NUMBER,
        },
        {
          label:
            "Transport expenses\n" +
            "Please consider only transport that concerns activities not listed before in the questionnaire\n",
          type: AnswerType.NUMBER,
        },
        {
          label: "Other",
          type: AnswerType.NUMBER,
          extra_answers: { type: AnswerType.TEXT },
        },
      ],
    }),
    new Item({
      id: "C1.2",
      question:
        "Please list below any prescribed medications you have taken in the past 3 months.\n" +
        "If you have taken the same medication at different doses, please list each dose in a separate row and indicate the duration for each dose if known.\n",
      answers: [
        {
          type: AnswerType.TEXT,
          label: "Medication name",
        },
        {
          type: AnswerType.RADIO,
          label: "Medication type",
          options: [
            { label: "tablet/capsule" },
            { label: "cream" },
            { label: "liquid" },
            { label: "injection" },
            {
              label: "other",
              extra_answers: [{ type: AnswerType.TEXT }],
            },
          ],
        },
        {
          type: AnswerType.NUMBER,
          label: "Dose",
        },
        {
          type: AnswerType.RADIO,
          label: "Unit",
          options: [
            { label: "mg" },
            { label: "g" },
            { label: "ml" },
            { label: "other", extra_answers: [{ type: AnswerType.TEXT }] },
          ],
        },
        {
          type: AnswerType.NUMBER,
          label: "How often have you taken the given medication?",
        },
        {
          type: AnswerType.RADIO,
          label: "",
          options: [
            { label: "per day" },
            { label: "per week" },
            { label: "per month" },
            { label: "as needed" },
            { label: "other", extra_answers: [{ type: AnswerType.TEXT }] },
          ],
        },
        {
          type: AnswerType.NUMBER,
          label:
            "For how long have you taken the given medication in the past 3 months?",
        },
        {
          type: AnswerType.RADIO,
          label: "",
          options: [
            { label: "day(s)" },
            { label: "week(s)" },
            { label: "month(s)" },
          ],
        },
      ],
    }),
  ],
  onComplete: (state) => {},
};

export const questionnaire: () => Questionnaire = () =>
  new Questionnaire(_state_properties);
