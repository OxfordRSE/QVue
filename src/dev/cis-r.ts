import {
  AnswerType,
  Item,
  Questionnaire,
  type QuestionnaireProperties,
  AnswerValidators,
} from "questionnaire-core";
import queryString from "query-string";
import { I18n } from "i18n-js";
import translations from "../i18n.json";

const i18n = new I18n(translations);
const parsed = queryString.parse(location.search);
if (parsed?.locale) i18n.locale = String(parsed.locale).toLowerCase();

export * from "questionnaire-core";

// Utility navigation functions
const panic_navigation = (state: Questionnaire) => {
  if (
    state.getItemById("anxiety")?.last_changed_answer?.selected_option
      ?.content === 1 &&
    state.getItemById("anxiety-tense")?.last_changed_answer?.selected_option
      ?.content === 1
  )
    return "anxiety-outro";
  return "panic";
};

export const _overall_navigation = (state: Questionnaire) => {
  const counters = [
    "somatic",
    "hypochondria",
    "fatigue",
    "sleep",
    "irritability",
    "concentration",
    "depression",
    "depressive_ideas",
    "phobia",
    "worry",
    "anxiety",
    "panic",
    "compulsions",
    "obsessions",
  ];
  let follow_up = false;
  counters.forEach((c) => {
    const v = state.counters.get(c, 0);
    if (v >= 2) follow_up = true;
  });
  return follow_up ? "overall-follow-up" : null;
};

// Questionnaire definition
export const _state_properties: QuestionnaireProperties = {
  name: "CIS-R",
  introduction: `
  <p>${i18n.t("cis_intro")}</p> 
  `,
  citation: `[Lewis G, Pelosi AJ, Araya R, et al. Measuring psychiatric disorders in the community: a standardised assessment for use by lay interviewers. *Psychological Medicine.* 1992;22:465–486](https://doi.org/10.1017/S0033291700030415)`,
  version: "0.0.1",
  reset_items_on_back: true,
  items: [
    new Item({
      id: "demo-intro",
      question: i18n.t("cis_demo-intro"),
      next_item: "demo-sex",
    }),
    new Item({
      id: "demo-sex",
      question: i18n.t("cis_demo-sex"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-sex-a1") },
            { content: 2, label: i18n.t("cis_demo-sex-a2") },
          ],
        },
      ],
      next_item: "demo-age",
    }),
    new Item({
      id: "demo-age",
      question: i18n.t("cis_demo-age"),
      answers: [{ type: AnswerType.NUMBER }],
      next_item: "demo-marital",
    }),
    new Item({
      id: "demo-marital",
      question: i18n.t("cis_demo-marital"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-marital-a1") },
            { content: 2, label: i18n.t("cis_demo-marital-a2") },
            { content: 3, label: i18n.t("cis_demo-marital-a3") },
            { content: 4, label: i18n.t("cis_demo-marital-a4") },
            { content: 5, label: i18n.t("cis_demo-marital-a5") },
          ],
        },
      ],
      next_item: "demo-employment",
    }),
    new Item({
      id: "demo-employment",
      question: i18n.t("cis_demo-employment"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-employment-a1") },
            { content: 2, label: i18n.t("cis_demo-employment-a2") },
            { content: 3, label: i18n.t("cis_demo-employment-a3") },
            { content: 4, label: i18n.t("cis_demo-employment-a4") },
            { content: 5, label: i18n.t("cis_demo-employment-a5") },
            { content: 6, label: i18n.t("cis_demo-employment-a6") },
            { content: 7, label: i18n.t("cis_demo-employment-a7") },
            {
              content: 8,
              label: i18n.t("cis_demo-employment-a8"),
            },
          ],
        },
      ],
      next_item: "demo-housing",
    }),
    new Item({
      id: "demo-housing",
      question: i18n.t("cis_demo-housing"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-housing-a1") },
            { content: 2, label: i18n.t("cis_demo-housing-a2") },
            { content: 3, label: i18n.t("cis_demo-housing-a3") },
            { content: 4, label: i18n.t("cis_demo-housing-a4") },
            { content: 5, label: i18n.t("cis_demo-housing-a5") },
            { content: 6, label: i18n.t("cis_demo-housing-a6") },
          ],
        },
      ],
      next_item: "health-intro",
    }),
    new Item({
      id: "health-intro",
      question: i18n.t("cis_demo-health-intro"),
      next_item: "health-appetite-loss",
    }),
    new Item({
      id: "health-appetite-loss",
      question: i18n.t("cis_demo-health-appetite-loss"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2) {
          state.counters.increment("depression_criterion_3", 1);
          state.counters.set("weight_detail", 1);
        }
      },
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 2
          ? "health-weight-loss"
          : "health-appetite-gain",
    }),
    new Item({
      id: "health-weight-loss",
      question: i18n.t("cis_demo-health-weight-loss"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 2
          ? "health-weight-loss-diet"
          : "health-gp-visits",
    }),
    new Item({
      id: "health-weight-loss-diet",
      question: i18n.t("cis_demo-health-weight-loss-diet"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            {
              content: 1,
              label: i18n.t("cis_demo-health-weight-loss-diet-a1"),
            },
            {
              content: 2,
              label: i18n.t("cis_demo-health-weight-loss-diet-a2"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 1) {
          state.counters.set("weight_detail", 2);
        }
      },
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 1
          ? "health-weight-loss-amount"
          : "health-gp-visits",
    }),
    new Item({
      id: "health-weight-loss-amount",
      question: i18n.t("cis_demo-health-weight-loss-amount"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            {
              content: 1,
              label: i18n.t("cis_demo-health-weight-loss-amount-a1"),
            },
            {
              content: 2,
              label: i18n.t("cis_demo-health-weight-loss-amount-a2"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 1) {
          state.counters.increment("depression_criterion_3", 1);
          state.counters.set("weight_detail", 3);
        }
      },
      next_item: "health-gp-visits",
    }),
    new Item({
      id: "health-appetite-gain",
      question: i18n.t("cis_demo-health-appetite-gain"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      next_item_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 1)
          return "health-gp-visits";
        if (last_changed_answer?.selected_option?.content === 2) {
          const sex_ans =
            state.getItemById("demo-sex")?.last_changed_answer?.selected_option
              ?.content;
          if (typeof sex_ans === "number")
            return sex_ans === 1
              ? "health-weight-gain-male"
              : "health-weight-gain-female";
        }
        throw `Could not determine next question for ${state.current_item?.id} [${last_changed_answer?.selected_option?.content}]`;
      },
    }),
    new Item({
      id: "health-weight-gain-male",
      question: i18n.t("cis_demo-health-weight-gain-male"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2) {
          state.counters.set("weight_detail", 2);
        }
      },
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 2
          ? "health-weight-gain-amount"
          : "health-gp-visits",
    }),
    new Item({
      id: "health-weight-gain-female",
      question: i18n.t("cis_demo-health-weight-gain-female"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
            {
              content: 3,
              label: i18n.t("cis_demo-health-weight-gain-female-a3"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2) {
          state.counters.set("weight_detail", 2);
        }
      },
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 2
          ? "health-weight-gain-amount"
          : "health-gp-visits",
    }),
    new Item({
      id: "health-weight-gain-amount",
      question: i18n.t("cis_demo-health-weight-gain-amount"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            {
              content: 1,
              label: i18n.t("cis_demo-health-weight-gain-amount-a1"),
            },
            {
              content: 2,
              label: i18n.t("cis_demo-health-weight-gain-amount-a2"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (
          last_changed_answer?.selected_option?.content === 1 &&
          state.counters.get("weight_detail", 0) === 2
        ) {
          state.counters.set("weight_detail", 4);
        }
      },
      next_item: "health-gp-visits",
    }),
    new Item({
      id: "health-gp-visits",
      question: i18n.t("cis_demo-health-gp-visits"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 0, label: i18n.t("cis_demo-generic-freq-a1") },
            { content: 1, label: i18n.t("cis_demo-generic-freq-a2") },
            { content: 2, label: i18n.t("cis_demo-generic-freq-a3") },
            { content: 3, label: i18n.t("cis_demo-generic-freq-a4") },
            { content: 4, label: i18n.t("cis_demo-generic-freq-a5") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (
          state.counters.get("weight_detail", 0) === 3 &&
          state.getItemById("health-appetite-loss")?.last_changed_answer
            ?.content === 2
        )
          state.counters.increment("depression_criterion_2", 1);
        if (
          state.counters.get("weight_detail", 0) === 4 &&
          state.getItemById("health-appetite-gain")?.last_changed_answer
            ?.content === 2
        )
          state.counters.increment("depression_criterion_2", 1);
      },
      next_item: "health-disability",
    }),
    new Item({
      id: "health-disability",
      question: i18n.t("cis_demo-health-disability"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      next_item: "health-illness",
    }),
    new Item({
      id: "health-illness",
      question: i18n.t("cis_demo-health-illness"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-health-illness-a1") },
            { content: 2, label: i18n.t("cis_demo-health-illness-a2") },
            { content: 3, label: i18n.t("cis_demo-health-illness-a3") },
            { content: 4, label: i18n.t("cis_demo-health-illness-a4") },
            { content: 5, label: i18n.t("cis_demo-health-illness-a5") },
            { content: 6, label: i18n.t("cis_demo-health-illness-a6") },
            { content: 7, label: i18n.t("cis_demo-health-illness-a7") },
            { content: 8, label: i18n.t("cis_demo-health-illness-a8") },
            { content: 9, label: i18n.t("cis_demo-health-illness-a9") },
          ],
        },
      ],
      next_item: "somatic-pain",
    }),
    new Item({
      id: "somatic-pain",
      question: i18n.t("cis_demo-somatic-pain"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 1
          ? "somatic-discomfort"
          : "somatic-stress",
    }),
    new Item({
      id: "somatic-stress",
      question: i18n.t("cis_demo-somatic-stress"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-freq-a6") },
            { content: 2, label: i18n.t("cis_demo-generic-freq-a7") },
            { content: 3, label: i18n.t("cis_demo-generic-freq-a8") },
          ],
        },
      ],
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 1
          ? "somatic-discomfort"
          : "somatic-pain-frequency",
    }),
    new Item({
      id: "somatic-pain-frequency",
      question: i18n.t("cis_demo-somatic-pain-frequency"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-freq-a9") },
            { content: 2, label: i18n.t("cis_demo-generic-freq-a10-day") },
            { content: 3, label: i18n.t("cis_demo-generic-freq-a11-day") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 3)
          state.counters.increment("somatic", 1);
      },
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 1
          ? "somatic-discomfort"
          : "somatic-pain-duration",
    }),
    new Item({
      id: "somatic-pain-duration",
      question: i18n.t("cis_demo-somatic-pain-duration"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-duration-a1") },
            {
              content: 2,
              label: i18n.t("cis_demo-generic-duration-a2"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("somatic", 1);
      },
      next_item: "somatic-pain-valence",
    }),
    new Item({
      id: "somatic-pain-valence",
      question: i18n.t("cis_demo-somatic-pain-valence"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-distress-a1") },
            { content: 2, label: i18n.t("cis_demo-generic-distress-a2") },
            { content: 3, label: i18n.t("cis_demo-generic-distress-a3") },
            { content: 4, label: i18n.t("cis_demo-generic-distress-a4") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (
          typeof last_changed_answer?.selected_option?.content === "number" &&
          last_changed_answer >= 3
        )
          state.counters.increment("somatic", 1);
      },
      next_item: "somatic-pain-distress",
    }),
    new Item({
      id: "somatic-pain-distress",
      question: i18n.t("cis_demo-somatic-pain-distress"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-somatic-pain-distress-a1") },
            {
              content: 2,
              label: i18n.t("cis_demo-somatic-pain-distress-a2"),
            },
            {
              content: 3,
              label: i18n.t("cis_demo-somatic-pain-distress-a3"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("somatic", 1);
      },
      next_item: "somatic-duration",
    }),
    new Item({
      id: "somatic-discomfort",
      question: i18n.t("cis_demo-somatic-discomfort"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 1
          ? "fatigue"
          : "somatic-discomfort-stress",
    }),
    new Item({
      id: "somatic-discomfort-stress",
      question: i18n.t("cis_demo-somatic-discomfort-stress"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-freq-a6") },
            { content: 2, label: i18n.t("cis_demo-generic-freq-a7") },
            { content: 3, label: i18n.t("cis_demo-generic-freq-a8") },
          ],
        },
      ],
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 1
          ? "fatigue"
          : "somatic-discomfort-frequency",
    }),
    new Item({
      id: "somatic-discomfort-frequency",
      question: i18n.t("cis_demo-somatic-discomfort-frequency"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-freq-a9") },
            { content: 2, label: i18n.t("cis_demo-generic-freq-a10-day") },
            { content: 3, label: i18n.t("cis_demo-generic-freq-a11-day") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 3)
          state.counters.increment("somatic", 1);
      },
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 1
          ? "fatigue"
          : "somatic-discomfort-long",
    }),
    new Item({
      id: "somatic-discomfort-long",
      question: i18n.t("cis_demo-somatic-discomfort-long"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-duration-a1") },
            {
              content: 2,
              label: i18n.t("cis_demo-generic-duration-a2"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("somatic", 1);
      },
      next_item: "somatic-discomfort-valence",
    }),
    new Item({
      id: "somatic-discomfort-valence",
      question: i18n.t("cis_demo-somatic-discomfort-valence"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-distress-a1") },
            { content: 2, label: i18n.t("cis_demo-generic-distress-a2") },
            { content: 3, label: i18n.t("cis_demo-generic-distress-a3") },
            { content: 4, label: i18n.t("cis_demo-generic-distress-a4") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (
          typeof last_changed_answer?.selected_option?.content === "number" &&
          last_changed_answer >= 3
        )
          state.counters.increment("somatic", 1);
      },
      next_item: "somatic-discomfort-distress",
    }),
    new Item({
      id: "somatic-discomfort-distress",
      question: i18n.t("cis_demo-somatic-discomfort-distress"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            {
              content: 1,
              label: i18n.t("cis_demo-somatic-discomfort-distress-a1"),
            },
            {
              content: 2,
              label: i18n.t("cis_demo-somatic-discomfort-distress-a2"),
            },
            {
              content: 3,
              label: i18n.t("cis_demo-somatic-discomfort-distress-a3"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("somatic", 1);
      },
      next_item: "somatic-duration",
    }),
    new Item({
      id: "somatic-duration",
      question: i18n.t("cis_demo-somatic-duration"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-duration-a3") },
            { content: 2, label: i18n.t("cis_demo-generic-duration-a4") },
            { content: 3, label: i18n.t("cis_demo-generic-duration-a5") },
            { content: 4, label: i18n.t("cis_demo-generic-duration-a6") },
            { content: 5, label: i18n.t("cis_demo-generic-duration-a7") },
            { content: 6, label: i18n.t("cis_demo-generic-duration-a8") },
          ],
        },
      ],
      next_item: "fatigue",
    }),
    new Item({
      id: "fatigue",
      question: i18n.t("cis_demo-fatigue"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        state.counters.set("score", state.counters.get("somatic", 0));
      },
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 1
          ? "fatigue-energy"
          : "fatigue-tired-cause",
    }),
    new Item({
      id: "fatigue-tired-cause",
      question: i18n.t("cis_demo-fatigue-tired-cause"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-cause-a1") },
            { content: 2, label: i18n.t("cis_demo-generic-cause-a2") },
            { content: 3, label: i18n.t("cis_demo-generic-cause-a3") },
            {
              content: 4,
              label: i18n.t("cis_demo-generic-cause-a4"),
            },
            {
              content: 5,
              label: i18n.t("cis_demo-generic-cause-a5"),
            },
            { content: 6, label: i18n.t("cis_demo-generic-cause-a6") },
            { content: 7, label: i18n.t("cis_demo-generic-cause-a7") },
            { content: 8, label: i18n.t("cis_demo-generic-cause-a8") },
          ],
        },
      ],
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 6
          ? "concentration"
          : "fatigue-tired-frequency",
    }),
    new Item({
      id: "fatigue-tired-frequency",
      question: i18n.t("cis_demo-fatigue-tired-frequency"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-freq-a9") },
            { content: 2, label: i18n.t("cis_demo-generic-freq-a10-day") },
            { content: 3, label: i18n.t("cis_demo-generic-freq-a11-day") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 3)
          state.counters.increment("fatigue", 1);
      },
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 1
          ? "fatigue-energy"
          : "fatigue-tired-duration",
    }),
    new Item({
      id: "fatigue-tired-duration",
      question: i18n.t("cis_demo-fatigue-tired-duration"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-duration-a1") },
            {
              content: 2,
              label: i18n.t("cis_demo-generic-duration-a2"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("fatigue", 1);
      },
      next_item: "fatigue-tired-push",
    }),
    new Item({
      id: "fatigue-tired-push",
      question: i18n.t("cis_demo-fatigue-tired-push"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a2") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("fatigue", 1);
      },
      next_item: "fatigue-tired-enjoy",
    }),
    new Item({
      id: "fatigue-tired-enjoy",
      question: i18n.t("cis_demo-fatigue-tired-enjoy"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-fatigue-tired-enjoy-a1") },
            { content: 2, label: i18n.t("cis_demo-fatigue-tired-enjoy-a2") },
            {
              content: 3,
              label: i18n.t("cis_demo-fatigue-tired-enjoy-a3"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("fatigue", 1);
      },
      next_item: "fatigue-duration",
    }),
    new Item({
      id: "fatigue-energy",
      question: i18n.t("cis_demo-fatigue-energy"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 1
          ? "concentration"
          : "fatigue-energy-cause",
    }),
    new Item({
      id: "fatigue-energy-cause",
      question: i18n.t("cis_demo-fatigue-energy-cause"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-cause-a1") },
            { content: 2, label: i18n.t("cis_demo-generic-cause-a2") },
            { content: 3, label: i18n.t("cis_demo-generic-cause-a3") },
            {
              content: 4,
              label: i18n.t("cis_demo-generic-cause-a4"),
            },
            {
              content: 5,
              label: i18n.t("cis_demo-generic-cause-a5"),
            },
            { content: 6, label: i18n.t("cis_demo-generic-cause-a6") },
            { content: 7, label: i18n.t("cis_demo-generic-cause-a7") },
            { content: 8, label: i18n.t("cis_demo-generic-cause-a8") },
          ],
        },
      ],
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 6
          ? "concentration"
          : "fatigue-energy-frequency",
    }),
    new Item({
      id: "fatigue-energy-frequency",
      question: i18n.t("cis_demo-fatigue-energy-frequency"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-freq-a9") },
            { content: 2, label: i18n.t("cis_demo-generic-freq-a10-day") },
            { content: 3, label: i18n.t("cis_demo-generic-freq-a11-day") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 3)
          state.counters.increment("fatigue", 1);
      },
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 1
          ? "concentration"
          : "fatigue-energy-duration",
    }),
    new Item({
      id: "fatigue-energy-duration",
      question: i18n.t("cis_demo-fatigue-energy-duration"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-duration-a1") },
            {
              content: 2,
              label: i18n.t("cis_demo-generic-duration-a2"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("fatigue", 1);
      },
      next_item: "fatigue-energy-push",
    }),
    new Item({
      id: "fatigue-energy-push",
      question: i18n.t("cis_demo-fatigue-energy-push"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a2") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("fatigue", 1);
      },
      next_item: "fatigue-energy-enjoy",
    }),
    new Item({
      id: "fatigue-energy-enjoy",
      question: i18n.t("cis_demo-fatigue-energy-enjoy"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-fatigue-energy-enjoy-a1") },
            { content: 2, label: i18n.t("cis_demo-fatigue-energy-enjoy-a2") },
            {
              content: 3,
              label: i18n.t("cis_demo-fatigue-energy-enjoy-a3"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("fatigue", 1);
      },
      next_item: "fatigue-duration",
    }),
    new Item({
      id: "fatigue-duration",
      question: i18n.t("cis_demo-fatigue-duration"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-duration-a3") },
            { content: 2, label: i18n.t("cis_demo-generic-duration-a4") },
            { content: 3, label: i18n.t("cis_demo-generic-duration-a5") },
            { content: 4, label: i18n.t("cis_demo-generic-duration-a6") },
            { content: 5, label: i18n.t("cis_demo-generic-duration-a7") },
            { content: 6, label: i18n.t("cis_demo-generic-duration-a8") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (
          state.counters.get("somatic", 0) >= 2 &&
          state.counters.get("fatigue", 0) >= 2
        )
          state.counters.increment("NEURAS", 1);
      },
      next_item: "concentration",
    }),

    new Item({
      id: "concentration",
      question: i18n.t("cis_demo-concentration"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            {
              content: 2,
              label: i18n.t("cis_demo-concentration-yes"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        const fatigue = state.counters.get("fatigue", 0);
        if (!fatigue) return;
        state.counters.increment("score", fatigue);
        if (fatigue >= 2) state.counters.increment("depression_criterion_1", 1);
      },
      next_item: "concentration-forgetting",
    }),
    new Item({
      id: "concentration-forgetting",
      question: i18n.t("cis_demo-concentration-forgetting"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      next_item_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (
          last_changed_answer?.selected_option?.content === 1 &&
          state.getItemById("concentration")?.last_changed_answer
            ?.selected_option?.content === 1
        )
          return "sleep-loss";
        return "concentration-frequency";
      },
    }),
    new Item({
      id: "concentration-frequency",
      question: i18n.t("cis_demo-concentration-frequency"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-freq-a9") },
            { content: 2, label: i18n.t("cis_demo-generic-freq-a10-day") },
            { content: 3, label: i18n.t("cis_demo-generic-freq-a11-day") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 3)
          state.counters.increment("concentration", 1);
      },
      next_item_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 1)
          return "sleep-loss";
        if (
          last_changed_answer?.selected_option?.content === 1 &&
          state.getItemById("concentration-forgetting")?.last_changed_answer
            ?.content === 2
        )
          return "concentration-forgetting-important";
        return "concentration-tasks";
      },
    }),
    new Item({
      id: "concentration-tasks",
      question: i18n.t("cis_demo-concentration-tasks"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-concentration-tasks-a1") },
            {
              content: 2,
              label: i18n.t("cis_demo-concentration-tasks-a2"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("concentration", 1);
      },
      next_item: "concentration-distress",
    }),
    new Item({
      id: "concentration-distress",
      question: i18n.t("cis_demo-concentration-distress"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("concentration", 1);
      },
      next_item: "concentration-duration",
    }),
    new Item({
      id: "concentration-duration",
      question: i18n.t("cis_demo-concentration-duration"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-duration-a3") },
            { content: 2, label: i18n.t("cis_demo-generic-duration-a4") },
            { content: 3, label: i18n.t("cis_demo-generic-duration-a5") },
            { content: 4, label: i18n.t("cis_demo-generic-duration-a6") },
            { content: 5, label: i18n.t("cis_demo-generic-duration-a7") },
            { content: 6, label: i18n.t("cis_demo-generic-duration-a8") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (
          state.counters.get("somatic", 0) >= 2 &&
          state.counters.get("fatigue", 0) >= 2
        )
          state.counters.increment("NEURAS", 1);
      },
      next_item_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (
          state.getItemById("concentration-forgetting")?.last_changed_answer
            ?.content === 1
        )
          return "sleep-loss";
        return "concentration-forgetting-important";
      },
    }),
    new Item({
      id: "concentration-forgetting-important",
      question: i18n.t("cis_demo-concentration-forgetting-important"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            {
              content: 2,
              label: i18n.t("cis_demo-concentration-forgetting-important-yes"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("concentration", 1);
      },
      next_item: "concentration-forgetting-duration",
    }),
    new Item({
      id: "concentration-forgetting-duration",
      question: i18n.t("cis_demo-concentration-forgetting-duration"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-duration-a3") },
            { content: 2, label: i18n.t("cis_demo-generic-duration-a4") },
            { content: 3, label: i18n.t("cis_demo-generic-duration-a5") },
            { content: 4, label: i18n.t("cis_demo-generic-duration-a6") },
            { content: 5, label: i18n.t("cis_demo-generic-duration-a7") },
            { content: 6, label: i18n.t("cis_demo-generic-duration-a8") },
          ],
        },
      ],
      next_item: "sleep-loss",
    }),
    new Item({
      id: "sleep-loss",
      question: i18n.t("cis_demo-sleep-loss"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        const conc = state.counters.get("concentration", 0);
        if (!conc) return;
        state.counters.increment("score", conc);
        if (conc >= 2) state.counters.increment("depression_criterion_2", 1);
      },
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 1
          ? "sleep-gain"
          : "sleep-loss-frequency",
    }),
    new Item({
      id: "sleep-loss-frequency",
      question: i18n.t("cis_demo-sleep-loss-frequency"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-freq-a9") },
            { content: 2, label: i18n.t("cis_demo-generic-freq-a10-night") },
            { content: 3, label: i18n.t("cis_demo-generic-freq-a11-night") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 3)
          state.counters.increment("sleep", 1);
      },
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 1
          ? "irritability"
          : "sleep-loss-time",
    }),
    new Item({
      id: "sleep-loss-time",
      question: i18n.t("cis_demo-sleep-loss-time"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-duration-a9") },
            { content: 2, label: i18n.t("cis_demo-generic-duration-a10") },
            { content: 3, label: i18n.t("cis_demo-generic-duration-a11") },
            { content: 4, label: i18n.t("cis_demo-generic-duration-a12") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        const v = last_changed_answer;
        if (!v) return;
        if (v === 2) state.counters.increment("sleep", 1);
        if (v >= 3) state.counters.increment("sleep", 2);
      },
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 1
          ? "irritability"
          : "sleep-loss-long",
    }),
    new Item({
      id: "sleep-loss-long",
      question: i18n.t("cis_demo-sleep-loss-long"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-freq-a9") },
            { content: 2, label: i18n.t("cis_demo-generic-freq-a10-night") },
            { content: 3, label: i18n.t("cis_demo-generic-freq-a11-night") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 3)
          state.counters.increment("sleep", 1);
      },
      next_item: "sleep-loss-morning",
    }),
    new Item({
      id: "sleep-loss-morning",
      question: i18n.t("cis_demo-sleep-loss-morning"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-sleep-loss-morning-yes") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        const v = last_changed_answer;
        const sleep = state.counters.get("sleep", 0);
        if (!v || !sleep) return;
        if (v >= 1 && sleep >= 1) state.counters.set("sleep_detail", 2);
        if (v === 2) {
          if (sleep >= 1) state.counters.set("sleep_detail", 1);
          state.counters.increment("depression_criterion_3", 1);
        }
      },
      next_item: "sleep-cause",
    }),
    new Item({
      id: "sleep-cause",
      question: i18n.t("cis_demo-sleep-cause"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-sleep-cause-a1") },
            { content: 2, label: i18n.t("cis_demo-sleep-cause-a2") },
            { content: 3, label: i18n.t("cis_demo-sleep-cause-a3") },
            { content: 4, label: i18n.t("cis_demo-sleep-cause-a4") },
            { content: 5, label: i18n.t("cis_demo-sleep-cause-a5") },
            { content: 6, label: i18n.t("cis_demo-sleep-cause-a6") },
          ],
        },
      ],
      next_item: "sleep-duration",
    }),
    new Item({
      id: "sleep-gain",
      question: i18n.t("cis_demo-sleep-gain"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            {
              content: 2,
              label: i18n.t("cis_demo-sleep-gain-yes"),
            },
            { content: 3, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer !== 3 ? "irritability" : "sleep-gain-frequency",
    }),
    new Item({
      id: "sleep-gain-frequency",
      question: i18n.t("cis_demo-sleep-gain-frequency"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-freq-a9") },
            { content: 2, label: i18n.t("cis_demo-generic-freq-a10-night") },
            { content: 3, label: i18n.t("cis_demo-generic-freq-a11-night") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 3)
          state.counters.increment("sleep", 1);
      },
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 1
          ? "irritability"
          : "sleep-gain-time",
    }),
    new Item({
      id: "sleep-gain-time",
      question: i18n.t("cis_demo-sleep-gain-time"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-duration-a9") },
            { content: 2, label: i18n.t("cis_demo-generic-duration-a10") },
            { content: 3, label: i18n.t("cis_demo-generic-duration-a11") },
            { content: 4, label: i18n.t("cis_demo-generic-duration-a12") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        const v = last_changed_answer;
        if (!v) return;
        if (v === 2) state.counters.increment("sleep", 1);
        if (v >= 3) state.counters.increment("sleep", 2);
        if (v >= 3 && state.counters.get("sleep_detail", 0) >= 1)
          state.counters.set("sleep_detail", 3);
      },
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 1
          ? "irritability"
          : "sleep-gain-long",
    }),
    new Item({
      id: "sleep-gain-long",
      question: i18n.t("cis_demo-sleep-gain-long"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-freq-a9") },
            { content: 2, label: i18n.t("cis_demo-generic-freq-a10-night") },
            { content: 3, label: i18n.t("cis_demo-generic-freq-a11-night") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 3)
          state.counters.increment("sleep", 1);
      },
      next_item: "sleep-duration",
    }),
    new Item({
      id: "sleep-duration",
      question: i18n.t("cis_demo-sleep-duration"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-duration-a3") },
            { content: 2, label: i18n.t("cis_demo-generic-duration-a4") },
            { content: 3, label: i18n.t("cis_demo-generic-duration-a5") },
            { content: 4, label: i18n.t("cis_demo-generic-duration-a6") },
            { content: 5, label: i18n.t("cis_demo-generic-duration-a7") },
            { content: 6, label: i18n.t("cis_demo-generic-duration-a8") },
          ],
        },
      ],
      next_item: "irritability",
    }),
    new Item({
      id: "irritability",
      question: i18n.t("cis_demo-irritability"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            {
              content: 2,
              label: i18n.t("cis_demo-irritability-yes"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        const sleep = state.counters.get("sleep", 0);
        if (!sleep) return;
        state.counters.increment("score", sleep);
        if (sleep >= 2) state.counters.increment("depression_criterion_2", 1);
      },
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 2
          ? "irritability-frequency"
          : "irritability-trivial",
    }),
    new Item({
      id: "irritability-trivial",
      question: i18n.t("cis_demo-irritability-trivial"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-freq-a7") },
            { content: 3, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 1
          ? "hypochondria"
          : "irritability-frequency",
    }),
    new Item({
      id: "irritability-frequency",
      question: i18n.t("cis_demo-irritability-frequency"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-freq-a9") },
            { content: 2, label: i18n.t("cis_demo-generic-freq-a10-day") },
            { content: 3, label: i18n.t("cis_demo-generic-freq-a11-day") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 3)
          state.counters.increment("irritability", 1);
      },
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 1
          ? "hypochondria"
          : "irritability-long",
    }),
    new Item({
      id: "irritability-long",
      question: i18n.t("cis_demo-irritability-long"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            {
              content: 2,
              label: i18n.t("cis_demo-irritability-long-yes"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("irritability", 1);
      },
      next_item: "irritability-shout",
    }),
    new Item({
      id: "irritability-shout",
      question: i18n.t("cis_demo-irritability-shout"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            {
              content: 2,
              label: i18n.t("cis_demo-irritability-shout-yes1"),
            },
            { content: 3, label: i18n.t("cis_demo-irritability-shout-yes2") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        const v = last_changed_answer;
        if (!v) return;
        if (v >= 2) state.counters.increment("irritability", 1);
      },
      next_item: "irritability-rows",
    }),
    new Item({
      id: "irritability-rows",
      question: i18n.t("cis_demo-irritability-rows"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-irritability-rows-yes") },
            { content: 3, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 3)
          state.counters.increment("irritability", 1);
      },
      next_item: "irritability-duration",
    }),
    new Item({
      id: "irritability-duration",
      question: i18n.t("cis_demo-irritability-duration"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-duration-a3") },
            { content: 2, label: i18n.t("cis_demo-generic-duration-a4") },
            { content: 3, label: i18n.t("cis_demo-generic-duration-a5") },
            { content: 4, label: i18n.t("cis_demo-generic-duration-a6") },
            { content: 5, label: i18n.t("cis_demo-generic-duration-a7") },
            { content: 6, label: i18n.t("cis_demo-generic-duration-a8") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        const irritation = state.counters.get("irritability", 0);
        const fatigue = state.counters.get("fatigue", 0);
        const sleep = state.counters.get("sleep", 0);
        if (irritation >= 2 && fatigue >= 2)
          state.counters.increment("NEURAS", 1);
        if (sleep >= 2 && fatigue >= 2) state.counters.increment("NEURAS", 1);
      },
      next_item: "hypochondria",
    }),
    new Item({
      id: "hypochondria",
      question: i18n.t("cis_demo-hypochondria"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        const irritability = state.counters.get("irritability", 0);
        if (!irritability) return;
        state.counters.increment("score", irritability);
      },
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 2
          ? "hypochondria-frequency"
          : "hypochondria-serious",
    }),
    new Item({
      id: "hypochondria-serious",
      question: i18n.t("cis_demo-hypochondria-serious"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 1
          ? "depression"
          : "hypochondria-frequency",
    }),
    new Item({
      id: "hypochondria-frequency",
      question: i18n.t("cis_demo-hypochondria-frequency"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-freq-a9") },
            { content: 2, label: i18n.t("cis_demo-generic-freq-a10-day") },
            { content: 3, label: i18n.t("cis_demo-generic-freq-a11-day") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 3)
          state.counters.increment("hypochondria", 1);
      },
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 1
          ? "depression"
          : "hypochondria-excessive",
    }),
    new Item({
      id: "hypochondria-excessive",
      question: i18n.t("cis_demo-hypochondria-excessive"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            {
              content: 2,
              label: i18n.t("cis_demo-hypochondria-excessive-yes"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("hypochondria", 1);
      },
      next_item: "hypochondria-valence",
    }),
    new Item({
      id: "hypochondria-valence",
      question: i18n.t("cis_demo-hypochondria-valence"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-distress-a1") },
            { content: 2, label: i18n.t("cis_demo-generic-distress-a2") },
            { content: 3, label: i18n.t("cis_demo-generic-distress-a3") },
            { content: 4, label: i18n.t("cis_demo-generic-distress-a4") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (!last_changed_answer) return;
        if (last_changed_answer >= 3)
          state.counters.increment("hypochondria", 1);
      },
      next_item: "hypochondria-distraction",
    }),
    new Item({
      id: "hypochondria-distraction",
      question: i18n.t("cis_demo-hypochondria-distraction"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-yes-a1") },
            {
              content: 2,
              label: i18n.t("cis_demo-hypochondria-distraction-yes"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("hypochondria", 1);
      },
      next_item: "hypochondria-duration",
    }),
    new Item({
      id: "hypochondria-duration",
      question: i18n.t("cis_demo-hypochondria-duration"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-duration-a3") },
            { content: 2, label: i18n.t("cis_demo-generic-duration-a4") },
            { content: 3, label: i18n.t("cis_demo-generic-duration-a5") },
            { content: 4, label: i18n.t("cis_demo-generic-duration-a6") },
            { content: 5, label: i18n.t("cis_demo-generic-duration-a7") },
            { content: 6, label: i18n.t("cis_demo-generic-duration-a8") },
          ],
        },
      ],
      next_item: "depression",
    }),
    new Item({
      id: "depression",
      question: i18n.t("cis_demo-depression"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        const hypochondria = state.counters.get("hypochondria", 0);
        if (!hypochondria) return;
        state.counters.increment("score", hypochondria);
      },
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 1
          ? "depression-enjoy"
          : "depression-recent",
    }),
    new Item({
      id: "depression-recent",
      question: i18n.t("cis_demo-depression-recent"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-depression-recent-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      next_item: "depression-enjoy",
    }),
    new Item({
      id: "depression-enjoy",
      question: i18n.t("cis_demo-depression-enjoy"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-yes-a1") },
            { content: 2, label: i18n.t("cis_demo-depression-enjoy-a1") },
            { content: 3, label: i18n.t("cis_demo-depression-enjoy-a2") },
          ],
        },
      ],
      next_item_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (
          last_changed_answer?.selected_option?.content === 1 &&
          state.getItemById("depression-recent")?.last_changed_answer
            ?.selected_option?.content !== 2
        )
          return "worry";
        return "depression-enjoy-recent";
      },
    }),
    new Item({
      id: "depression-enjoy-recent",
      question: i18n.t("cis_demo-depression-enjoy-recent"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-yes-a1") },
            { content: 2, label: i18n.t("cis_demo-depression-enjoy-a1") },
            { content: 3, label: i18n.t("cis_demo-depression-enjoy-a2") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (!last_changed_answer) return;
        if (last_changed_answer >= 2) {
          state.counters.increment("depression", 1);
          state.counters.increment("depression_criterion_1", 1);
          state.counters.increment("depression_criterion_3", 1);
        }
      },
      next_item_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (
          last_changed_answer?.selected_option?.content === 1 &&
          state.getItemById("depression-recent")?.last_changed_answer
            ?.selected_option?.content === 1
        )
          return "worry";
        return "depression-sad";
      },
    }),
    new Item({
      id: "depression-sad",
      question: i18n.t("cis_demo-depression-sad"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-freq-a9") },
            { content: 2, label: i18n.t("cis_demo-generic-freq-a10-day") },
            { content: 3, label: i18n.t("cis_demo-generic-freq-a11-day") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 3)
          state.counters.increment("depression", 1);
      },
      next_item: "depression-sad-long",
    }),
    new Item({
      id: "depression-sad-long",
      question: i18n.t("cis_demo-depression-sad-long"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-duration-a1") },
            {
              content: 2,
              label: i18n.t("cis_demo-generic-duration-a2"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        const v = last_changed_answer;
        if (!v) return;
        if (v === 2) state.counters.increment("depression", 1);
        if (
          v === 2 &&
          state.getItemById("depression-sad")?.last_changed_answer
            ?.selected_option?.content === 3 &&
          state.getItemById("depression-sad-long")?.last_changed_answer
            ?.content === 2
        )
          state.counters.increment("depression_criterion_1", 1);
      },
      next_item: "depression-content",
    }),
    new Item({
      id: "depression-content",
      question: i18n.t("cis_demo-depression-content"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            {
              content: 1,
              label: i18n.t("cis_demo-depression-content-a1"),
            },
            {
              content: 2,
              label: i18n.t("cis_demo-depression-content-a2"),
            },
            { content: 3, label: i18n.t("cis_demo-depression-content-a3") },
            { content: 4, label: i18n.t("cis_demo-depression-content-a4") },
            {
              content: 5,
              label: i18n.t("cis_demo-depression-content-a5"),
            },
            { content: 6, label: i18n.t("cis_demo-depression-content-a6") },
            { content: 7, label: i18n.t("cis_demo-depression-content-a7") },
            { content: 8, label: i18n.t("cis_demo-depression-content-a8") },
            { content: 9, label: i18n.t("cis_demo-depression-content-a9") },
          ],
        },
      ],
      next_item: "depression-company",
    }),
    new Item({
      id: "depression-company",
      question: i18n.t("cis_demo-depression-company"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-depression-company-a1") },
            { content: 2, label: i18n.t("cis_demo-depression-company-a2") },
            { content: 3, label: i18n.t("cis_demo-depression-company-a3") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        const v = last_changed_answer;
        if (!v) return;
        if (v >= 2) {
          state.counters.increment("depression", 1);
          state.counters.increment("depression_criterion_3", 1);
        }
      },
      next_item: "depression-duration",
    }),
    new Item({
      id: "depression-duration",
      question: i18n.t("cis_demo-depression-duration"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-duration-a3") },
            { content: 2, label: i18n.t("cis_demo-generic-duration-a4") },
            { content: 3, label: i18n.t("cis_demo-generic-duration-a5") },
            { content: 4, label: i18n.t("cis_demo-generic-duration-a6") },
            { content: 5, label: i18n.t("cis_demo-generic-duration-a7") },
            { content: 6, label: i18n.t("cis_demo-generic-duration-a8") },
          ],
        },
      ],
      next_item_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (state.counters.get("depression", 0) > 0) return "worry";
        return "depression-detail-time";
      },
    }),
    new Item({
      id: "depression-detail-time",
      question: i18n.t("cis_demo-depression-detail-time"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-depression-detail-time-a1") },
            { content: 2, label: i18n.t("cis_demo-depression-detail-time-a2") },
            {
              content: 3,
              label: i18n.t("cis_demo-depression-detail-time-a3"),
            },
            { content: 4, label: i18n.t("cis_demo-depression-detail-time-a4") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        const v = last_changed_answer;
        if (!v) return;
        if (v <= 2) state.counters.set("DVM", v);
        if (v === 1) state.counters.increment("depression_criterion_3", 1);
      },
      next_item: "depression-detail-sex",
    }),
    new Item({
      id: "depression-detail-sex",
      question: i18n.t("cis_demo-depression-detail-sex"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-depression-detail-sex-a1") },
            { content: 2, label: i18n.t("cis_demo-depression-detail-sex-a2") },
            { content: 3, label: i18n.t("cis_demo-depression-detail-sex-a3") },
            { content: 4, label: i18n.t("cis_demo-depression-detail-sex-a4") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 4) {
          state.counters.set("libido", 1);
          state.counters.increment("depression_criterion_3", 1);
        }
      },
      next_item: "depression-detail-restless",
    }),
    new Item({
      id: "depression-detail-restless",
      question: i18n.t("cis_demo-depression-detail-restless"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.set("PSYCHMOT", 2);
      },
      next_item: "depression-detail-slow",
    }),
    new Item({
      id: "depression-detail-slow",
      question: i18n.t("cis_demo-depression-detail-slow"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.set("PSYCHMOT", 1);
        if ([1, 2].includes(state.counters.get("PSYCHMOT", 0))) {
          state.counters.increment("depression_criterion_2", 1);
          state.counters.increment("depression_criterion_3", 1);
        }
      },
      next_item: "depression-detail-guilt",
    }),
    new Item({
      id: "depression-detail-guilt",
      question: i18n.t("cis_demo-depression-detail-guilt"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            {
              content: 1,
              label: i18n.t("cis_demo-depression-detail-guilt-a1"),
            },
            {
              content: 2,
              label: i18n.t("cis_demo-depression-detail-guilt-a2"),
            },
            {
              content: 3,
              label: i18n.t("cis_demo-depression-detail-guilt-a3"),
            },
            {
              content: 4,
              label: i18n.t("cis_demo-depression-detail-guilt-a4"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        const v = last_changed_answer;
        if (!v) return;
        if (v >= 3) {
          state.counters.increment("depressive_ideas", 1);
          state.counters.increment("depression_criterion_2", 1);
        }
      },
      next_item: "depression-detail-worth",
    }),
    new Item({
      id: "depression-detail-worth",
      question: i18n.t("cis_demo-depression-detail-worth"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            {
              content: 1,
              label: i18n.t("cis_demo-depression-detail-worth-no"),
            },
            {
              content: 2,
              label: i18n.t("cis_demo-depression-detail-worth-yes"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2) {
          state.counters.increment("depressive_ideas", 1);
          state.counters.increment("depression_criterion_2", 1);
        }
      },
      next_item: "depression-detail-hopeless",
    }),
    new Item({
      id: "depression-detail-hopeless",
      question: i18n.t("cis_demo-depression-detail-hopeless"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            {
              content: 2,
              label: i18n.t("cis_demo-depression-detail-hopeless-yes"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2) {
          state.counters.increment("depressive_ideas", 1);
          state.counters.increment("suicide", 1);
        }
      },
      next_item_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (!state.counters.get("depressive_ideas", 0))
          return "depression-outro";
        return "depression-suicide";
      },
    }),
    new Item({
      id: "depression-suicide",
      question: i18n.t("cis_demo-depression-suicide"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-freq-a7") },
            { content: 3, label: i18n.t("cis_demo-generic-freq-a8") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        const v = last_changed_answer;
        if (!v) return;
        if (v >= 2) {
          state.counters.increment("depressive_ideas", 1);
          state.counters.set("suicide", 2);
        }
      },
      next_item_fun: (last_changed_answer: any) => {
        if (last_changed_answer?.selected_option?.content === 1)
          return "depression-outro";
        return "depression-suicide-thoughts";
      },
    }),
    new Item({
      id: "depression-suicide-thoughts",
      question: i18n.t("cis_demo-depression-suicide-thoughts"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            {
              content: 2,
              label: i18n.t("cis_demo-depression-suicide-thoughts-yes1"),
            },
            {
              content: 3,
              label: i18n.t("cis_demo-depression-suicide-thoughts-yes2"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        const v = last_changed_answer;
        if (!v) return;
        if (v >= 2) {
          state.counters.set("suicide", 3);
          if (v === 3) {
            state.counters.increment("depressive_ideas", 1);
            state.counters.increment("depression_criterion_2", 1);
          }
        }
      },
      next_item_fun: (last_changed_answer: any) => {
        if (last_changed_answer?.selected_option?.content === 1)
          return "depression-outro";
        if (last_changed_answer?.selected_option?.content === 2)
          return "depression-suicide-doctor";
        return "depression-suicide-method";
      },
    }),
    new Item({
      id: "depression-suicide-method",
      question: i18n.t("cis_demo-depression-suicide-method"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.set("suicide", 4);
      },
      next_item: "depression-suicide-doctor",
    }),
    new Item({
      id: "depression-suicide-doctor",
      question: i18n.t("cis_demo-depression-suicide-doctor"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-yes-a1") },
            {
              content: 2,
              label: i18n.t("cis_demo-depression-suicide-doctor-no"),
            },
            { content: 3, label: i18n.t("cis_demo-generic-no") },
          ],
        },
      ],
      next_item_fun: (last_changed_answer: any) => {
        if (last_changed_answer?.selected_option?.content === 1)
          return "depression-outro";
        return "depression-suicide-referral";
      },
    }),
    new Item({
      id: "depression-suicide-referral",
      question: i18n.t("cis_demo-depression-suicide-referral"),
      next_item: "depression-outro",
    }),
    new Item({
      id: "depression-outro",
      question: i18n.t("cis_demo-depression-suicide-outro"),
      next_item: "worry",
    }),
    new Item({
      id: "worry",
      question: i18n.t("cis_demo-worry"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-freq-a7") },
            { content: 3, label: i18n.t("cis_demo-worry-a3") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        state.counters.increment("score", state.counters.get("depression", 0));
        state.counters.increment(
          "score",
          state.counters.get("depressive_ideas", 0)
        );
      },
      next_item_fun: (last_changed_answer: any) => {
        if (last_changed_answer?.selected_option?.content === 1)
          return "worry-any";
        return "worry-content";
      },
    }),
    new Item({
      id: "worry-any",
      question: i18n.t("cis_demo-worry-any"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      next_item_fun: (last_changed_answer: any) => {
        if (last_changed_answer?.selected_option?.content === 1)
          return "anxiety";
        return "worry-content";
      },
    }),
    new Item({
      id: "worry-content",
      question: i18n.t("cis_demo-worry-content"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            {
              content: 1,
              label: i18n.t("cis_demo-worry-content-a1"),
            },
            {
              content: 2,
              label: i18n.t("cis_demo-worry-content-a2"),
            },
            { content: 3, label: i18n.t("cis_demo-worry-content-a3") },
            { content: 4, label: i18n.t("cis_demo-worry-content-a4") },
            {
              content: 5,
              label: i18n.t("cis_demo-worry-content-a5"),
            },
            { content: 6, label: i18n.t("cis_demo-worry-content-a6") },
            { content: 7, label: i18n.t("cis_demo-worry-content-a7") },
            { content: 8, label: i18n.t("cis_demo-worry-content-a8") },
            { content: 9, label: i18n.t("cis_demo-worry-content-a9") },
          ],
        },
      ],
      next_item: "worry-intro",
    }),
    new Item({
      id: "worry-intro",
      question: i18n.t("cis_demo-worry-intro"),
      next_item: "worry-frequency",
    }),
    new Item({
      id: "worry-frequency",
      question: i18n.t("cis_demo-worry-frequency"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-freq-a9") },
            { content: 2, label: i18n.t("cis_demo-generic-freq-a10-day") },
            { content: 3, label: i18n.t("cis_demo-generic-freq-a11-day") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 3)
          state.counters.increment("worry", 1);
      },
      next_item_fun: (last_changed_answer: any) => {
        if (last_changed_answer?.selected_option?.content === 1)
          return "anxiety";
        return "worry-excessive";
      },
    }),
    new Item({
      id: "worry-excessive",
      question: i18n.t("cis_demo-worry-excessive"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-worry-excessive-yes") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("worry", 1);
      },
      next_item: "worry-valence",
    }),
    new Item({
      id: "worry-valence",
      question: i18n.t("cis_demo-worry-valence"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-distress-a1") },
            { content: 2, label: i18n.t("cis_demo-generic-distress-a2") },
            { content: 3, label: i18n.t("cis_demo-generic-distress-a3") },
            { content: 4, label: i18n.t("cis_demo-generic-distress-a4") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        const v = last_changed_answer;
        if (!v) return;
        if (v >= 3) state.counters.increment("worry", 1);
      },
      next_item: "worry-long",
    }),
    new Item({
      id: "worry-long",
      question: i18n.t("cis_demo-worry-long"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-duration-a1") },
            {
              content: 2,
              label: i18n.t("cis_demo-worry-long-yes"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("worry", 1);
      },
      next_item: "worry-duration",
    }),
    new Item({
      id: "worry-duration",
      question: i18n.t("cis_demo-worry-duration"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-duration-a3") },
            { content: 2, label: i18n.t("cis_demo-generic-duration-a4") },
            { content: 3, label: i18n.t("cis_demo-generic-duration-a5") },
            { content: 4, label: i18n.t("cis_demo-generic-duration-a6") },
            { content: 5, label: i18n.t("cis_demo-generic-duration-a7") },
            { content: 6, label: i18n.t("cis_demo-generic-duration-a8") },
          ],
        },
      ],
      next_item: "anxiety",
    }),
    new Item({
      id: "anxiety",
      question: i18n.t("cis_demo-anxiety"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        state.counters.increment("score", state.counters.get("worry", 0));
      },
      next_item: "anxiety-tense",
    }),
    new Item({
      id: "anxiety-tense",
      question: i18n.t("cis_demo-anxiety-tense"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-freq-a7") },
            { content: 3, label: i18n.t("cis_demo-generic-freq-a12") },
          ],
        },
      ],
      next_item_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (
          last_changed_answer?.selected_option?.content === 1 &&
          state.getItemById("anxiety")?.last_changed_answer?.selected_option
            ?.content === 1
        )
          return "phobia";
        return "anxiety-phobia";
      },
    }),
    new Item({
      id: "anxiety-phobia",
      question: i18n.t("cis_demo-anxiety-phobia"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      next_item_fun: (last_changed_answer: any) => {
        if (last_changed_answer?.selected_option?.content === 1)
          return "anxiety-frequency";
        return "anxiety-phobia-only";
      },
    }),
    new Item({
      id: "anxiety-phobia-only",
      question: i18n.t("cis_demo-anxiety-phobia-only"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            {
              content: 1,
              label: i18n.t("cis_demo-anxiety-phobia-only-a1"),
            },
            {
              content: 2,
              label: i18n.t("cis_demo-anxiety-phobia-only-a2"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => state.counters.increment("phobia", 1),
      next_item_fun: (last_changed_answer: any) => {
        if (last_changed_answer?.selected_option?.content === 1)
          return "phobia_type";
        return "anxiety-intro";
      },
    }),
    new Item({
      id: "anxiety-intro",
      question: i18n.t("cis_demo-anxiety-intro"),
      next_item: "anxiety-frequency",
    }),
    new Item({
      id: "anxiety-frequency",
      question: i18n.t("cis_demo-anxiety-frequency"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-freq-a9") },
            { content: 2, label: i18n.t("cis_demo-generic-freq-a10-day") },
            { content: 3, label: i18n.t("cis_demo-generic-freq-a11-day") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 3)
          state.counters.increment("anxiety", 1);
      },
      next_item_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 1) {
          if (state.counters.get("phobia", 0) === 1) return "phobia_type";
          return "compulsions";
        }
        return "anxiety-valence";
      },
    }),
    new Item({
      id: "anxiety-valence",
      question: i18n.t("cis_demo-anxiety-valence"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-distress-a1") },
            { content: 2, label: i18n.t("cis_demo-generic-distress-a2") },
            { content: 3, label: i18n.t("cis_demo-generic-distress-a3") },
            { content: 4, label: i18n.t("cis_demo-generic-distress-a4") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        const v = last_changed_answer;
        if (!v) return;
        if (v >= 3) state.counters.increment("anxiety", 1);
      },
      next_item: "anxiety-heart",
    }),
    new Item({
      id: "anxiety-heart",
      question: i18n.t("cis_demo-anxiety-heart"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("AN4", 1);
      },
      next_item: "anxiety-dizzy",
    }),
    new Item({
      id: "anxiety-dizzy",
      question: i18n.t("cis_demo-anxiety-dizzy"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("AN4", 1);
      },
      next_item: "anxiety-nausea",
    }),
    new Item({
      id: "anxiety-nausea",
      question: i18n.t("cis_demo-anxiety-nausea"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("AN4", 1);
      },
      next_item: "anxiety-sweating",
    }),
    new Item({
      id: "anxiety-sweating",
      question: i18n.t("cis_demo-anxiety-sweating"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("AN4", 1);
      },
      next_item: "anxiety-breathless",
    }),
    new Item({
      id: "anxiety-breathless",
      question: i18n.t("cis_demo-anxiety-breathless"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("AN4", 1);
      },
      next_item: "anxiety-dry-mouth",
    }),
    new Item({
      id: "anxiety-dry-mouth",
      question: i18n.t("cis_demo-anxiety-dry-mouth"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("AN4", 1);
      },
      next_item: "anxiety-chest-pain",
    }),
    new Item({
      id: "anxiety-chest-pain",
      question: i18n.t("cis_demo-anxiety-chest-pain"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("AN4", 1);
      },
      next_item: "anxiety-numb",
    }),
    new Item({
      id: "anxiety-numb",
      question: i18n.t("cis_demo-anxiety-numb"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("AN4", 1);
        if (state.counters.get("AN4", 0))
          state.counters.increment("anxiety", 1);
      },
      next_item: "anxiety-long",
    }),
    new Item({
      id: "anxiety-long",
      question: i18n.t("cis_demo-anxiety-long"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-anxiety-long-a2") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("anxiety", 1);
      },
      next_item: "anxiety-duration",
    }),
    new Item({
      id: "anxiety-duration",
      question: i18n.t("cis_demo-anxiety-duration"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-duration-a3") },
            { content: 2, label: i18n.t("cis_demo-generic-duration-a4") },
            { content: 3, label: i18n.t("cis_demo-generic-duration-a5") },
            { content: 4, label: i18n.t("cis_demo-generic-duration-a6") },
            { content: 5, label: i18n.t("cis_demo-generic-duration-a7") },
            { content: 6, label: i18n.t("cis_demo-generic-duration-a8") },
          ],
        },
      ],
      next_item_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (state.counters.get("phobia", 0) === 1) return "phobia_type";
        const anx = state.counters.get("anxiety", 0);
        if (anx <= 1) return "compulsions";
        return panic_navigation(state);
      },
    }),
    new Item({
      id: "phobia",
      question: i18n.t("cis_demo-phobia"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      next_item_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 1) {
          const anx = state.counters.get("anxiety", 0);
          if (anx <= 1) return "compulsions";
          return panic_navigation(state);
        } else return "phobia_type";
      },
    }),
    new Item({
      id: "phobia_type",
      question: i18n.t("cis_demo-phobia_type"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-phobia_type-a1") },
            { content: 2, label: i18n.t("cis_demo-phobia_type-a2") },
            { content: 3, label: i18n.t("cis_demo-phobia_type-a3") },
            { content: 4, label: i18n.t("cis_demo-phobia_type-a4") },
            { content: 5, label: i18n.t("cis_demo-phobia_type-a5") },
            { content: 6, label: i18n.t("cis_demo-phobia_type-a6") },
            { content: 7, label: i18n.t("cis_demo-phobia_type-a7") },
            { content: 8, label: i18n.t("cis_demo-phobia_type-a8") },
            {
              content: 9,
              label: i18n.t("cis_demo-phobia_type-a9"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        const v = last_changed_answer;
        if (!v) return;
        let type = 0;
        if ([1, 2, 5].includes(v)) type = 1;
        else if ([3, 7].includes(v)) type = 2;
        else if (v === 4) type = 3;
        else if ([6, 8].includes(v)) type = 4;
        state.counters.set("phobia_type", type);
      },
      next_item: "phobia-frequency",
    }),
    new Item({
      id: "phobia-frequency",
      question: i18n.t("cis_demo-phobia-frequency"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-freq-a9") },
            { content: 2, label: i18n.t("cis_demo-generic-freq-a10-day") },
            { content: 3, label: i18n.t("cis_demo-generic-freq-a11-day") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 3)
          state.counters.increment("phobia", 1);
      },
      next_item_fun: (last_changed_answer: any) => {
        if (last_changed_answer?.selected_option?.content === 1)
          return "phobia-avoid";
        return "phobia-heart";
      },
    }),
    new Item({
      id: "phobia-heart",
      question: i18n.t("cis_demo-phobia-heart"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("PHO2", 1);
      },
      next_item: "phobia-dizzy",
    }),
    new Item({
      id: "phobia-dizzy",
      question: i18n.t("cis_demo-phobia-dizzy"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("PHO2", 1);
      },
      next_item: "phobia-nausea",
    }),
    new Item({
      id: "phobia-nausea",
      question: i18n.t("cis_demo-phobia-nausea"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("PHO2", 1);
      },
      next_item: "phobia-sweating",
    }),
    new Item({
      id: "phobia-sweating",
      question: i18n.t("cis_demo-phobia-sweating"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("PHO2", 1);
      },
      next_item: "phobia-breathless",
    }),
    new Item({
      id: "phobia-breathless",
      question: i18n.t("cis_demo-phobia-breathless"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("PHO2", 1);
      },
      next_item: "phobia-dry-mouth",
    }),
    new Item({
      id: "phobia-dry-mouth",
      question: i18n.t("cis_demo-phobia-dry-mouth"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("PHO2", 1);
      },
      next_item: "phobia-chest-pain",
    }),
    new Item({
      id: "phobia-chest-pain",
      question: i18n.t("cis_demo-phobia-chest-pain"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("PHO2", 1);
      },
      next_item: "phobia-numb",
    }),
    new Item({
      id: "phobia-numb",
      question: i18n.t("cis_demo-phobia-numb"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("PHO2", 1);
        if (state.counters.get("PHO2", 0))
          state.counters.increment("phobia", 1);
      },
      next_item: "phobia-avoid",
    }),
    new Item({
      id: "phobia-avoid",
      question: i18n.t("cis_demo-phobia-avoid"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a2") },
          ],
        },
      ],
      next_item_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 1) {
          const anx = state.counters.get("anxiety", 0);
          const pho = state.counters.get("phobia", 0);
          if (anx <= 1 && !pho) return "anxiety-outro";
          if (anx >= 2 || pho) return panic_navigation(state);
        }
        return "phobia-avoid-frequency";
      },
    }),
    new Item({
      id: "phobia-avoid-frequency",
      question: i18n.t("cis_demo-phobia-avoid-frequency"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-freq-a1") },
            { content: 2, label: i18n.t("cis_demo-generic-freq-a13") },
            { content: 3, label: i18n.t("cis_demo-generic-freq-a14") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("phobia", 1);
        if (last_changed_answer?.selected_option?.content === 3)
          state.counters.increment("phobia", 2);
      },
      next_item_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        const anx = state.counters.get("anxiety", 0);
        if (
          state.getItemById("phobia-frequency")?.last_changed_answer
            ?.selected_option?.content === 1 &&
          anx <= 1
        )
          return "anxiety-outro";
        return "phobia-duration";
      },
    }),
    new Item({
      id: "phobia-duration",
      question: i18n.t("cis_demo-phobia-duration"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-duration-a3") },
            { content: 2, label: i18n.t("cis_demo-generic-duration-a4") },
            { content: 3, label: i18n.t("cis_demo-generic-duration-a5") },
            { content: 4, label: i18n.t("cis_demo-generic-duration-a6") },
            { content: 5, label: i18n.t("cis_demo-generic-duration-a7") },
            { content: 6, label: i18n.t("cis_demo-generic-duration-a8") },
          ],
        },
      ],
      next_item_fun: (ans, item, state) => panic_navigation(state),
    }),
    new Item({
      id: "panic",
      question: i18n.t("cis_demo-panic"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-panic-no") },
            { content: 2, label: i18n.t("cis_demo-panic-yes1") },
            { content: 3, label: i18n.t("cis_demo-panic-yes2") },
          ],
        },
      ],
      next_item_fun: (last_changed_answer: any) => {
        if (last_changed_answer?.selected_option?.content === 1)
          return "anxiety-outro";
        return "panic-frequency";
      },
    }),
    new Item({
      id: "panic-frequency",
      question: i18n.t("cis_demo-panic-frequency"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-panic-frequency-a1") },
            { content: 2, label: i18n.t("cis_demo-panic-frequency-a2") },
            { content: 3, label: i18n.t("cis_demo-panic-frequency-a3") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("panic", 1);
        if (last_changed_answer?.selected_option?.content === 3)
          state.counters.increment("panic", 2);
      },
      next_item_fun: (last_changed_answer: any) => {
        if (last_changed_answer?.selected_option?.content === 1)
          return "anxiety-outro";
        return "panic-valence";
      },
    }),
    new Item({
      id: "panic-valence",
      question: i18n.t("cis_demo-panic-valence"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-panic-valence-a1") },
            { content: 2, label: i18n.t("cis_demo-panic-valence-a2") },
            { content: 3, label: i18n.t("cis_demo-panic-valence-a3") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 3)
          state.counters.increment("panic", 1);
      },
      next_item: "panic-long",
    }),
    new Item({
      id: "panic-long",
      question: i18n.t("cis_demo-panic-long"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-panic-long-a1") },
            { content: 2, label: i18n.t("cis_demo-panic-long-a2") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("panic", 1);
      },
      next_item: "panic-sudden",
    }),
    new Item({
      id: "panic-sudden",
      question: i18n.t("cis_demo-panic-sudden"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      next_item: "panic-heart",
    }),
    new Item({
      id: "panic-heart",
      question: i18n.t("cis_demo-panic-heart"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("panic-symptoms", 1);
      },
      next_item: "panic-sweat",
    }),
    new Item({
      id: "panic-sweat",
      question: i18n.t("cis_demo-panic-sweat"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("panic-symptoms", 1);
      },
      next_item: "panic-shake",
    }),
    new Item({
      id: "panic-shake",
      question: i18n.t("cis_demo-panic-shake"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("panic-symptoms", 1);
      },
      next_item: "panic-breathless",
    }),
    new Item({
      id: "panic-breathless",
      question: i18n.t("cis_demo-panic-breathless"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("panic-symptoms", 1);
      },
      next_item: "panic-choke",
    }),
    new Item({
      id: "panic-choke",
      question: i18n.t("cis_demo-panic-choke"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("panic-symptoms", 1);
      },
      next_item: "panic-chest-pain",
    }),
    new Item({
      id: "panic-chest-pain",
      question: i18n.t("cis_demo-panic-pain"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("panic-symptoms", 1);
      },
      next_item: "panic-nausea",
    }),
    new Item({
      id: "panic-nausea",
      question: i18n.t("cis_demo-panic-nausea"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("panic-symptoms", 1);
      },
      next_item: "panic-dizzy",
    }),
    new Item({
      id: "panic-dizzy",
      question: i18n.t("cis_demo-panic-dizzy"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("panic-symptoms", 1);
      },
      next_item: "panic-derealization",
    }),
    new Item({
      id: "panic-derealization",
      question: i18n.t("cis_demo-panic-derealization"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("panic-symptoms", 1);
      },
      next_item: "panic-crazy",
    }),
    new Item({
      id: "panic-crazy",
      question: i18n.t("cis_demo-panic-crazy"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("panic-symptoms", 1);
      },
      next_item: "panic-dying",
    }),
    new Item({
      id: "panic-dying",
      question: i18n.t("cis_demo-panic-dying"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("panic-symptoms", 1);
      },
      next_item: "panic-tingling",
    }),
    new Item({
      id: "panic-tingling",
      question: i18n.t("cis_demo-panic-tingling"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("panic-symptoms", 1);
      },
      next_item: "panic-chills",
    }),
    new Item({
      id: "panic-chills",
      question: i18n.t("cis_demo-panic-chills"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("panic-symptoms", 1);
      },
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 1
          ? "panic-duration"
          : "panic-specific",
    }),
    new Item({
      id: "panic-specific",
      question: i18n.t("cis_demo-panic-specific"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-yes-a1") },
          ],
        },
      ],
      next_item: "panic-duration",
    }),
    new Item({
      id: "panic-duration",
      question: i18n.t("cis_demo-panic-duration"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-duration-a3") },
            { content: 2, label: i18n.t("cis_demo-generic-duration-a4") },
            { content: 3, label: i18n.t("cis_demo-generic-duration-a5") },
            { content: 4, label: i18n.t("cis_demo-generic-duration-a6") },
            { content: 5, label: i18n.t("cis_demo-generic-duration-a7") },
            { content: 6, label: i18n.t("cis_demo-generic-duration-a8") },
          ],
        },
      ],
      next_item: "anxiety-outro",
    }),
    new Item({
      id: "anxiety-outro",
      question: i18n.t("cis_demo-anxiety-outro"),
      next_item: "compulsions",
    }),
    new Item({
      id: "compulsions",
      question: i18n.t("cis_demo-compulsions"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-freq-a7") },
            { content: 3, label: i18n.t("cis_demo-generic-freq-a12") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        state.counters.increment("score", state.counters.get("anxiety", 0));
        state.counters.increment("score", state.counters.get("phobia", 0));
        state.counters.increment("score", state.counters.get("panic", 0));
      },
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 1
          ? "obsessions"
          : "compulsions-frequency",
    }),
    new Item({
      id: "compulsions-frequency",
      question: i18n.t("cis_demo-compulsions-frequency"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-freq-a9") },
            { content: 2, label: i18n.t("cis_demo-generic-freq-a10-day") },
            { content: 3, label: i18n.t("cis_demo-generic-freq-a11-day") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 3)
          state.counters.increment("compulsions", 1);
      },
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer?.selected_option?.content === 1
          ? "obsessions"
          : "compulsions-control",
    }),
    new Item({
      id: "compulsions-control",
      question: i18n.t("cis_demo-compulsions-control"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-compulsions-control-a1") },
            { content: 2, label: i18n.t("cis_demo-compulsions-control-a2") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("compulsions", 1);
      },
      next_item: "compulsions-valence",
    }),
    new Item({
      id: "compulsions-valence",
      question: i18n.t("cis_demo-compulsions-valence"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-compulsions-valence-a1") },
            { content: 2, label: i18n.t("cis_demo-compulsions-valence-a2") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("compulsions", 1);
      },
      next_item: "compulsions-repeats",
    }),
    new Item({
      id: "compulsions-repeats",
      question: i18n.t("cis_demo-compulsions-repeats"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-compulsions-repeats-a1") },
            { content: 2, label: i18n.t("cis_demo-compulsions-repeats-a2") },
            { content: 3, label: i18n.t("cis_demo-compulsions-repeats-a3") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 3)
          state.counters.increment("compulsions", 1);
      },
      next_item: "compulsions-duration",
    }),
    new Item({
      id: "compulsions-duration",
      question: i18n.t("cis_demo-compulsions-duration"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-duration-a3") },
            { content: 2, label: i18n.t("cis_demo-generic-duration-a4") },
            { content: 3, label: i18n.t("cis_demo-generic-duration-a5") },
            { content: 4, label: i18n.t("cis_demo-generic-duration-a6") },
            { content: 5, label: i18n.t("cis_demo-generic-duration-a7") },
            { content: 6, label: i18n.t("cis_demo-generic-duration-a8") },
          ],
        },
      ],
      next_item: "obsessions",
    }),
    new Item({
      id: "obsessions",
      question: i18n.t("cis_demo-obsessions"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-no") },
            { content: 2, label: i18n.t("cis_demo-generic-freq-a7") },
            { content: 3, label: i18n.t("cis_demo-generic-freq-a12") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        state.counters.increment("score", state.counters.get("compulsions", 0));
      },
      next_item_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) =>
        last_changed_answer?.selected_option?.content === 1
          ? _overall_navigation(state)
          : "obsessions-repeat",
    }),
    new Item({
      id: "obsessions-repeat",
      question: i18n.t("cis_demo-obsessions-repeat"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            {
              content: 1,
              label: i18n.t("cis_demo-obsessions-repeat-a1"),
            },
            { content: 2, label: i18n.t("cis_demo-obsessions-repeat-a2") },
          ],
        },
      ],
      next_item_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) =>
        last_changed_answer?.selected_option?.content === 2
          ? _overall_navigation(state)
          : "obsessions-frequency",
    }),
    new Item({
      id: "obsessions-frequency",
      question: i18n.t("cis_demo-obsessions-frequency"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-freq-a9") },
            { content: 2, label: i18n.t("cis_demo-generic-freq-a10-day") },
            { content: 3, label: i18n.t("cis_demo-generic-freq-a11-day") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 3)
          state.counters.increment("obsessions", 1);
      },
      next_item_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) =>
        last_changed_answer?.selected_option?.content === 2
          ? _overall_navigation(state)
          : "obsessions-control",
    }),
    new Item({
      id: "obsessions-control",
      question: i18n.t("cis_demo-obsessions-control"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-obsessions-control-a1") },
            {
              content: 2,
              label: i18n.t("cis_demo-obsessions-control-a2"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("obsessions", 1);
      },
      next_item: "obsessions-valence",
    }),
    new Item({
      id: "obsessions-valence",
      question: i18n.t("cis_demo-obsessions-valence"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-obsessions-valence-a1") },
            {
              content: 2,
              label: i18n.t("cis_demo-obsessions-valence-a2"),
            },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("obsessions", 1);
      },
      next_item: "obsessions-long",
    }),
    new Item({
      id: "obsessions-long",
      question: i18n.t("cis_demo-obsessions-long"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-obsessions-long-a1") },
            { content: 2, label: i18n.t("cis_demo-obsessions-long-a2") },
          ],
        },
      ],
      process_answer_fun: (
        last_changed_answer: any,
        current_item: Item,
        state: Questionnaire
      ) => {
        if (last_changed_answer?.selected_option?.content === 2)
          state.counters.increment("obsessions", 1);
        state.counters.increment("score", state.counters.get("obsessions", 0));
      },
      next_item: "obsessions-duration",
    }),
    new Item({
      id: "obsessions-duration",
      question: i18n.t("cis_demo-obsessions-duration"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-generic-duration-a3") },
            { content: 2, label: i18n.t("cis_demo-generic-duration-a4") },
            { content: 3, label: i18n.t("cis_demo-generic-duration-a5") },
            { content: 4, label: i18n.t("cis_demo-generic-duration-a6") },
            { content: 5, label: i18n.t("cis_demo-generic-duration-a7") },
            { content: 6, label: i18n.t("cis_demo-generic-duration-a8") },
          ],
        },
      ],
      next_item_fun: (ans, item, state) => _overall_navigation(state),
    }),
    new Item({
      id: "overall-follow-up",
      question: i18n.t("cis_demo-overall-follow-up"),
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: i18n.t("cis_demo-overall-follow-up-a1") },
            {
              content: 2,
              label: i18n.t("cis_demo-overall-follow-up-a2"),
            },
            { content: 3, label: i18n.t("cis_demo-overall-follow-up-a3") },
            { content: 4, label: i18n.t("cis_demo-overall-follow-up-a4") },
          ],
        },
      ],
      next_item_fun: () => null,
    }),
  ],
  onComplete: (state) => {
    const now = new Date();
    const diagnoses = [
      "No diagnosis identified",
      "ICD10 Mixed anxiety & depressive disorder (mild)",
      "ICD10 Generalised anxiety disorder - mild",
      "ICD10 Obsessive-compulsive disorder",
      "ICD10 Mixed anxiety and depressive disorder",
      "ICD10 Specific (isolated) phobia",
      "ICD10 Social phobia",
      "ICD10 Agoraphobia",
      "ICD10 Generalised anxiety disorder",
      "ICD10 Panic disorder",
      "ICD10 Mild depressive episode",
      "ICD10 Moderate depressive episode",
      "ICD10 Severe depressive episode",
    ];

    const impairment = [
      "None",
      "More difficult but everything gets done",
      "One activity stopped",
      "More than one activity stopped",
    ];

    const outputs = {
      DIAG1: 0,
      DIAG2: 0,
      GAD: 0,
      DEPRMILD: 0,
      PANICD: 0,
      PHOBAG: 0,
      PHOBSOC: 0,
      PHOBSPEC: 0,
      OBCOMP: 0,
      DEPRMOD: 0,
      DEPRSEV: 0,
      CFS: 0,
    };

    const counters: {
      anxiety: number;
      AN4: number;
      panic: number;
      phobia: number;
      phobia_type: number;
      obsessions: number;
      compulsions: number;
      depression_criterion_1: number;
      depression_criterion_2: number;
      depression_criterion_3: number;
      NEURAS: number;
      score: number;
      somatic: number;
      hypochondria: number;
      irritability: number;
      concentration: number;
      fatigue: number;
      sleep: number;
      sleep_detail: number;
      depression: number;
      weight_detail: number;
      depressive_ideas: number;
      worry: number;
    } = {
      anxiety: state.counters.get("anxiety", 0),
      AN4: state.counters.get("AN4", 0),
      panic: state.counters.get("panic", 0),
      phobia: state.counters.get("phobia", 0),
      phobia_type: state.counters.get("phobia_type", -1),
      obsessions: state.counters.get("obsessions", 0),
      compulsions: state.counters.get("compulsions", 0),
      depression_criterion_1: state.counters.get("depression_criterion_1", 0),
      depression_criterion_2: state.counters.get("depression_criterion_2", 0),
      depression_criterion_3: state.counters.get("depression_criterion_3", 0),
      NEURAS: state.counters.get("NEURAS", 0),
      score: state.counters.get("score", 0),
      somatic: state.counters.get("somatic", 0),
      hypochondria: state.counters.get("hypochondria", 0),
      irritability: state.counters.get("irritability", 0),
      concentration: state.counters.get("concentration", 0),
      fatigue: state.counters.get("fatigue", 0),
      sleep: state.counters.get("sleep", 0),
      sleep_detail: state.counters.get("sleep_detail", 0),
      depression: state.counters.get("depression", 0),
      weight_detail: state.counters.get("weight_detail", 0),
      depressive_ideas: state.counters.get("depressive_ideas", 0),
      worry: state.counters.get("worry", 0),
    };

    // Generalized anxiety
    const anx_dur =
      state.getItemById("anxiety-duration")?.last_changed_answer
        ?.selected_option?.content || 0;
    if (counters.anxiety >= 2 && counters.AN4 >= 2 && anx_dur >= 3)
      outputs.GAD = 1;

    // Panic
    const pan =
      state.getItemById("panic-sudden")?.last_changed_answer?.selected_option
        ?.content || 0;
    if (counters.panic >= 3 && pan === 2) outputs.PANICD = 1;

    // Phobias
    const pho =
      state.getItemById("phobia-avoid")?.last_changed_answer?.selected_option
        ?.content || 0;
    if (pho === 2 && counters.phobia >= 2) {
      if (counters["phobia_type"] === 1) outputs.PHOBAG = 1;
      if (counters["phobia_type"] === 2) outputs.PHOBSOC = 1;
      if (counters["phobia_type"] >= 3) outputs.PHOBSPEC = 1;
      if (counters["phobia_type"] === 0) outputs.PHOBSPEC = 1;
    }

    // Obsessive-compulsions
    const ob =
      state.getItemById("obsessions-control")?.last_changed_answer
        ?.selected_option?.content || 0;
    const co =
      state.getItemById("compulsions-control")?.last_changed_answer
        ?.selected_option?.content || 0;
    const ob_dur =
      state.getItemById("obsessions-duration")?.last_changed_answer
        ?.selected_option?.content || 0;
    const co_dur =
      state.getItemById("compulsions-duration")?.last_changed_answer
        ?.selected_option?.content || 0;
    const imp =
      state.getItemById("overall-follow-up")?.last_changed_answer
        ?.selected_option?.content || 0;
    if (imp >= 2) {
      if (ob === 2 && ob_dur >= 2) {
        if (
          counters.obsessions + counters.compulsions >= 6 ||
          counters.obsessions === 4
        )
          outputs.OBCOMP = 1;
      }
      if (co === 2 && co_dur >= 2) {
        if (
          counters.obsessions + counters.compulsions >= 6 ||
          counters.compulsions === 4
        )
          outputs.OBCOMP = 1;
      }
    }

    // Depression
    const dep_dur =
      state.getItemById("depression-duration")?.last_changed_answer
        ?.selected_option?.content || 0;
    if (dep_dur >= 2) {
      if (
        counters["depression_criterion_1"] > 1 &&
        counters["depression_criterion_1"] +
          counters["depression_criterion_2"] >
          3
      ) {
        if (
          counters["depression_criterion_1"] +
            counters["depression_criterion_2"] >
          5
        )
          outputs.DEPRMOD = 1;
        else outputs.DEPRMILD = 1;
      }
      if (
        counters["depression_criterion_1"] === 3 &&
        counters["depression_criterion_2"] > 4
      )
        outputs.DEPRSEV = 1;
    }

    // Diagnosis
    if (outputs.DIAG1 === 0 && counters.NEURAS >= 2) outputs.CFS = 1;

    if (counters.score >= 12) outputs.DIAG1 = 1;
    if (outputs.GAD) outputs.DIAG1 = 2;
    if (outputs.OBCOMP) outputs.DIAG1 = 3;
    if (counters.score >= 20) outputs.DIAG1 = 4;
    if (outputs.PHOBSPEC) outputs.DIAG1 = 5;
    if (outputs.PHOBSOC) outputs.DIAG1 = 6;
    if (outputs.PHOBAG) outputs.DIAG1 = 7;
    if (outputs.GAD && counters.score >= 20) outputs.DIAG1 = 8;
    if (outputs.PANICD) outputs.DIAG1 = 9;
    if (outputs.DEPRMILD) outputs.DIAG1 = 10;
    if (outputs.DEPRMOD) outputs.DIAG1 = 11;
    if (outputs.DEPRSEV) outputs.DIAG1 = 12;

    if (outputs.DIAG1 >= 2 && counters.score >= 12) outputs.DIAG2 = 1;
    if (outputs.DIAG1 >= 3 && outputs.GAD) outputs.DIAG2 = 2;
    if (outputs.DIAG1 >= 4 && outputs.OBCOMP) outputs.DIAG2 = 3;
    if (outputs.DIAG1 >= 5 && counters.score >= 20) outputs.DIAG2 = 4;
    if (outputs.DIAG1 >= 6 && outputs.PHOBSPEC) outputs.DIAG2 = 5;
    if (outputs.DIAG1 >= 7 && outputs.PHOBSOC) outputs.DIAG2 = 6;
    if (outputs.DIAG1 >= 8 && outputs.PHOBAG) outputs.DIAG2 = 7;
    if (outputs.DIAG1 >= 9 && outputs.GAD && counters.score >= 20)
      outputs.DIAG2 = 8;
    if (outputs.DIAG1 >= 10 && outputs.PANICD) outputs.DIAG2 = 9;

    state.data = {
      summary: `
      <h1>CIS-R output</h1>
      <div class="datetime text-muted">
        <span class="date">${now.toLocaleDateString()}</span> 
        <span class="time">${now.toLocaleTimeString()}</span>
      </div>
      <div class="disclaimer my-2 small">
        The results should only be used in conjunction with a clinical assessment
      </div>
      <ul class="major-output list-unstyled">
        <li class="d-flex">
          <strong class="label">Primary Diagnosis:</strong> 
          <span class="content flex-grow-1 text-end">${
            diagnoses[outputs.DIAG1]
          }</span>
        </li>
        <li class="d-flex">
          <strong class="label">Secondary Diagnosis:</strong> 
          <span class="content flex-grow-1 text-end">${
            diagnoses[outputs.DIAG2]
          }</span>
        </li>
        <li class="d-flex">
          <strong class="label">Total score:</strong> 
          <span class="content flex-grow-1 text-end">${counters.score}</span>
        </li>
      </ul>
      <ul class="minor-output list-unstyled">
        <li class="d-flex ${counters.somatic > 2 ? "mark" : ""}">
          <strong class="label">Somatic symptoms:</strong> 
          <span class="content flex-grow-1 text-end">${counters.somatic}</span>
        </li>
        <li class="d-flex ${counters.hypochondria > 2 ? "mark" : ""}">
          <strong class="label">Worry over Physical Health:</strong> 
          <span class="content flex-grow-1 text-end">${
            counters.hypochondria
          }</span>
        </li>
        <li class="d-flex ${counters.irritability > 2 ? "mark" : ""}">
          <strong class="label">Irritability:</strong> 
          <span class="content flex-grow-1 text-end">${
            counters.irritability
          }</span>
        </li>
        <li class="d-flex ${counters.concentration > 2 ? "mark" : ""}">
          <strong class="label">Poor concentration:</strong> 
          <span class="content flex-grow-1 text-end">${
            counters.concentration
          }</span>
        </li>
        <li class="d-flex ${counters.fatigue > 2 ? "mark" : ""}">
          <strong class="label">Fatigue:</strong> 
          <span class="content flex-grow-1 text-end">${counters.fatigue}</span>
        </li>
        <li class="d-flex flex-wrap ${counters.sleep > 2 ? "mark" : ""}">
          <strong class="label">Sleep problems:</strong> 
          <span class="content flex-grow-1 text-end">${counters.sleep}</span>
        </li>
          <p class="detail small ms-4 my-0 text-justify${
            counters.sleep_detail ? "" : " d-none"
          }">
            ${
              counters.sleep_detail === 1
                ? "Patient reports early morning waking"
                : counters.sleep_detail === 2
                ? "Patient reports insomnia but not early morning waking"
                : "Patient reports sleeping more than usual"
            }
          </p>
        <li class="d-flex flex-wrap ${counters.depression > 2 ? "mark" : ""}">
          <strong class="label">Depression:</strong> 
          <span class="content flex-grow-1 text-end">${
            counters.depression
          }</span>
        </li>
          <p class="detail small ms-4 my-0 text-justify${
            counters.weight_detail < 2 ? " d-none" : ""
          }">
            ${
              counters.weight_detail === 2
                ? "Patient has lost/gained weight but less than half a stone"
                : counters.weight_detail === 3
                ? "Patient has lost more than half a stone in weight"
                : "Patient has gained more than half a stone in weight"
            }
          </p>
        <li class="d-flex ${counters.depressive_ideas > 2 ? "mark" : ""}">
          <strong class="label">Depressive Ideas:</strong> 
          <span class="content flex-grow-1 text-end">${
            counters.depressive_ideas
          }</span>
        </li>
        <li class="d-flex ${counters.phobia > 2 ? "mark" : ""}">
          <strong class="label">Phobias:</strong> 
          <span class="content flex-grow-1 text-end">${counters.phobia}</span>
        </li>
        <li class="d-flex ${counters.worry > 2 ? "mark" : ""}">
          <strong class="label">Worry:</strong> 
          <span class="content flex-grow-1 text-end">${counters.worry}</span>
        </li>
        <li class="d-flex ${counters.anxiety > 2 ? "mark" : ""}">
          <strong class="label">Anxiety:</strong> 
          <span class="content flex-grow-1 text-end">${counters.anxiety}</span>
        </li>
        <li class="d-flex ${counters.panic > 2 ? "mark" : ""}">
          <strong class="label">Panic:</strong> 
          <span class="content flex-grow-1 text-end">${counters.panic}</span>
        </li>
        <li class="d-flex ${counters.compulsions > 2 ? "mark" : ""}">
          <strong class="label">Compulsions:</strong> 
          <span class="content flex-grow-1 text-end">${
            counters.compulsions
          }</span>
        </li>
        <li class="d-flex ${counters.obsessions > 2 ? "mark" : ""}">
          <strong class="label">Obsessions:</strong> 
          <span class="content flex-grow-1 text-end">${
            counters.obsessions
          }</span>
        </li>
        <li class="d-flex ${imp ? "mark" : ""}">
          <strong class="label">Social Impairment:</strong> 
          <span class="content flex-grow-1 text-end">${
            impairment[<number>imp]
          }</span>
        </li>
      </ul>
      `,
      key_data: {
        time: now.toUTCString(),
        primary_diagnosis_code: outputs.DIAG1,
        primary_diagnosis_label: diagnoses[outputs.DIAG1],
        secondary_diagnosis_code: outputs.DIAG2,
        secondary_diagnosis_label: diagnoses[outputs.DIAG2],
        total_score: counters.score,
      },
      items: state.items
        .filter((i) => i.answers.length === 1)
        .filter((i) => typeof i.answer.raw_content !== "undefined")
        .map((i) => {
          const answer_content: any =
            i.answer.type === AnswerType.RADIO
              ? i.answer.selected_option
              : i.answer.raw_content;
          return {
            id: i.id,
            question: i.question,
            answer: answer_content,
          };
        }),
      datetime: now.toUTCString(),
    };
  },
};

_state_properties.items
  .filter((i) => i.answers?.length === 1)
  // @ts-ignore
  .map((i) => i.answer)
  .forEach((a) => a.validators.push(AnswerValidators.REQUIRED));

export const questionnaire: () => Questionnaire = () =>
  new Questionnaire(_state_properties);