import {
  AnswerType,
  Item,
  Questionnaire,
  type QuestionnaireProperties,
} from "questionnaire-core";

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
  items: [
    new Item({
      id: "demo-intro",
      question:
        "To begin with, I would like to ask you about yourself and your background",
      next_item: "demo-sex",
    }),
    new Item({
      id: "demo-sex",
      question: "Are you male or female?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Male" },
            { content: 2, label: "Female" },
          ],
        },
      ],
      next_item: "demo-age",
    }),
    new Item({
      id: "demo-age",
      question: "How old are you?",
      answers: [{ type: AnswerType.NUMBER }],
      next_item: "demo-marital",
    }),
    new Item({
      id: "demo-marital",
      question: "What is your marital status?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Married/Living as married" },
            { content: 2, label: "Single" },
            { content: 3, label: "Separated" },
            { content: 4, label: "Divorced" },
            { content: 5, label: "Widowed" },
          ],
        },
      ],
      next_item: "demo-employment",
    }),
    new Item({
      id: "demo-employment",
      question: "What is your current employment status?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Employed full-time" },
            { content: 2, label: "Employed part-time" },
            { content: 3, label: "Studying at school, college or university" },
            { content: 4, label: "Retired" },
            { content: 5, label: "Houseperson" },
            { content: 6, label: "Unemployed job seeker" },
            { content: 7, label: "Unemployed due to ill-health" },
            {
              content: 8,
              label: "On a government or other employment training scheme",
            },
          ],
        },
      ],
      next_item: "demo-housing",
    }),
    new Item({
      id: "demo-housing",
      question: "What is your housing situation?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Home owner" },
            { content: 2, label: "Renting" },
            { content: 3, label: "Living with relative or friend" },
            { content: 4, label: "Hostel or care home" },
            { content: 5, label: "Homeless" },
            { content: 6, label: "Other" },
          ],
        },
      ],
      next_item: "health-intro",
    }),
    new Item({
      id: "health-intro",
      question: "I would now like to ask you about your health and well-being",
      next_item: "health-appetite-loss",
    }),
    new Item({
      id: "health-appetite-loss",
      question:
        "Have you noticed a marked LOSS in your appetite in the PAST MONTH?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question: "Have you lost any weight in the PAST MONTH?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question: "Were you trying to lose weight or on a diet?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No, I was not trying to lose weight" },
            { content: 2, label: "Yes, I have been trying to lose weight" },
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
      question:
        "Did you lose half a stone or more, or did you lose less than this (in the PAST MONTH)?\n\n(NOTE: Half a stone = 7 pounds or 3 kg)",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "I lost half a stone or more" },
            { content: 2, label: "I lost less than half a stone" },
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
      question:
        "Have you noticed a marked INCREASE in your appetite in the PAST MONTH?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question: "Have you gained any weight in the PAST MONTH?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question: "Have you gained any weight in the PAST MONTH?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
            { content: 3, label: "Yes, but I am pregnant" },
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
      question:
        "Did you gain half a stone or more, or did you gain less than this (in the PAST MONTH)?\n\n(NOTE: Half a stone = 7 pounds or 3 kg)",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "I gained half a stone or more" },
            { content: 2, label: "I gained less than half a stone" },
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
      question:
        "In the PAST YEAR, approximately how many times have you talked to or visited a GP or family doctor about your OWN health? Do NOT include any visits to hospital.",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 0, label: "None" },
            { content: 1, label: "1 or 2 times" },
            { content: 2, label: "3 to 5 times" },
            { content: 3, label: "6 to 10 times" },
            { content: 4, label: "More than 10 times" },
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
      question:
        "Do you have any long-standing illness, disability or infirmity?\n\nLong-standing means anything that has troubled you over a period of time or that is likely to affect you over a period of time",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
          ],
        },
      ],
      next_item: "health-illness",
    }),
    new Item({
      id: "health-illness",
      question:
        "Do you have any of the following conditions? If you have more than one condition answer for the most serious condition.",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Diabetes" },
            { content: 2, label: "Asthma or COPD" },
            { content: 3, label: "Arthritis" },
            { content: 4, label: "Heart disease or heart problems" },
            { content: 5, label: "Stroke" },
            { content: 6, label: "Cancer" },
            { content: 7, label: "Kidney disease" },
            { content: 8, label: "Mental health problems" },
            { content: 9, label: "None of the above" },
          ],
        },
      ],
      next_item: "somatic-pain",
    }),
    new Item({
      id: "somatic-pain",
      question:
        "Have you had ANY sort of aches or pains in the PAST MONTH, including headaches or indigestion?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "Was this pain or ache BROUGHT ON or MADE WORSE because you were feeling low, anxious or stressed?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Never" },
            { content: 2, label: "Sometimes" },
            { content: 3, label: "Always" },
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
      question:
        "On how many days have you noticed this pain during the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "None" },
            { content: 2, label: "Between one and three days" },
            { content: 3, label: "Four days or more" },
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
      question:
        "In total, did the pain or ache last for more than 3 hours on ANY day during the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No, less than 3 hours" },
            {
              content: 2,
              label:
                "Yes, it has lasted for more than 3 hours on at least one day",
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
      question: "Has the pain been unpleasant in the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Not at all" },
            { content: 2, label: "A little unpleasant" },
            { content: 3, label: "Unpleasant" },
            { content: 4, label: "Very unpleasant" },
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
      question:
        "Has the pain bothered you when you were doing something interesting in the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No, pain has not bothered me" },
            {
              content: 2,
              label: "Yes, pain bothered me while doing something interesting",
            },
            {
              content: 3,
              label: "I haven't done anything interesting in the past week",
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
      question:
        "Have you been troubled by any sort of bodily discomfort in THE PAST MONTH?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "Was this discomfort BROUGHT ON or MADE WORSE because you were feeling low, anxious or stressed?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Never" },
            { content: 2, label: "Sometimes" },
            { content: 3, label: "Always" },
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
      question:
        "On how many days have you noticed this discomfort during the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "None" },
            { content: 2, label: "Between one and three days" },
            { content: 3, label: "Four days or more" },
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
      question:
        "In total, did the discomfort last for more than 3 hours on ANY day during the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No, less than 3 hours" },
            {
              content: 2,
              label:
                "Yes, it has lasted for more than 3 hours on at least one day",
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
      question: "Has the discomfort been unpleasant in the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Not at all" },
            { content: 2, label: "A little unpleasant" },
            { content: 3, label: "Unpleasant" },
            { content: 4, label: "Very unpleasant" },
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
      question:
        "Has the discomfort bothered you when you were doing something interesting in the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No, discomfort has not bothered me" },
            {
              content: 2,
              label:
                "Yes, discomfort bothered me while doing something interesting",
            },
            {
              content: 3,
              label: "I haven't done anything interesting in the past week",
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
      question:
        "How long have you been feeling this ache, pain or discomfort as you have just described?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Less than 2 weeks" },
            { content: 2, label: "Between 2 weeks and 6 months" },
            { content: 3, label: "Between 6 months and 1 year" },
            { content: 4, label: "Between 1 and 2 years" },
            { content: 5, label: "Between 2 and 5 years" },
            { content: 6, label: "More than 5 years" },
          ],
        },
      ],
      next_item: "fatigue",
    }),
    new Item({
      id: "fatigue",
      question:
        "Have you noticed that you've been getting tired in the PAST MONTH?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question: "What do you think is the main reason for feeling tired?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Problems with sleep" },
            { content: 2, label: "Tablets or medication" },
            { content: 3, label: "Physical illness" },
            {
              content: 4,
              label: "Working too hard, including looking after children",
            },
            {
              content: 5,
              label: "Stress, worry or other psychological reason",
            },
            { content: 6, label: "Physical exercise" },
            { content: 7, label: "Other cause" },
            { content: 8, label: "Don't know" },
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
      question:
        "On how many days have you felt tired during the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "None" },
            { content: 2, label: "Between one and three days" },
            { content: 3, label: "Four days or more" },
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
      question:
        "Have you felt tired for more than 3 hours in total on ANY day in the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No, less than 3 hours" },
            {
              content: 2,
              label:
                "Yes, I felt tired for more than 3 hours on at least one day",
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
      question:
        "Have you felt so tired that you've had to push yourself to get things done during the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes, on one or more occasion" },
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
      question:
        "Have you felt tired when doing things that you enjoy during the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No, not tired during enjoyable activities" },
            { content: 2, label: "Yes, tired during an enjoyable activity" },
            {
              content: 3,
              label: "I haven't done anything enjoyable in the past week",
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
      question:
        "During the PAST MONTH, have you felt you've been lacking in energy?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question: "What do you think is the main reason for lacking in energy?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Problems with sleep" },
            { content: 2, label: "Tablets or medication" },
            { content: 3, label: "Physical illness" },
            {
              content: 4,
              label: "Working too hard, including looking after children",
            },
            {
              content: 5,
              label: "Stress, worry or other psychological reason",
            },
            { content: 6, label: "Physical exercise" },
            { content: 7, label: "Other cause" },
            { content: 8, label: "Don't know" },
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
      question:
        "On how many days have you felt lacking in energy during the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "None" },
            { content: 2, label: "Between one and three days" },
            { content: 3, label: "Four days or more" },
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
      question:
        "Have you felt lacking in energy for more than 3 hours in total on ANY day in the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No, less than 3 hours" },
            {
              content: 2,
              label:
                "Yes, I felt tired for more than 3 hours on at least one day",
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
      question:
        "Have you felt so lacking in energy that you've had to push yourself to get things done during the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes, on one or more occasion" },
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
      question:
        "Have you felt lacking in energy when doing things that you enjoy during the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No, not tired during enjoyable activities" },
            { content: 2, label: "Yes, tired during an enjoyable activity" },
            {
              content: 3,
              label: "I haven't done anything enjoyable in the past week",
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
      question:
        "How long have you been feeling tired or lacking in energy in the way you have just described?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Less than 2 weeks" },
            { content: 2, label: "Between 2 weeks and 6 months" },
            { content: 3, label: "Between 6 months and 1 year" },
            { content: 4, label: "Between 1 and 2 years" },
            { content: 5, label: "Between 2 and 5 years" },
            { content: 6, label: "More than 5 years" },
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
      question:
        "In the PAST MONTH, have you had any problems in concentrating on what you are doing?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            {
              content: 2,
              label: "Yes, problems concentrating on what I am doing",
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
      question:
        "Have you noticed any problems with forgetting things in the PAST MONTH?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "On how many days have you noticed problems with your concentration OR your memory during the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "None" },
            { content: 2, label: "Between one and three days" },
            { content: 3, label: "Four days or more" },
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
      question:
        "In the PAST SEVEN DAYS could you concentrate on all of the following without your mind wandering?:\n\na whole TV programme\n\na newspaper article\n\ntalking to someone?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Yes, I could concentrate on all of them" },
            {
              content: 2,
              label:
                "No, I couldn't concentrate on at least one of these things",
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
      question:
        "In the PAST SEVEN DAYS, have these problems with your concentration actually STOPPED you from getting on with things you used to do or would like to do?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "How long have you been having problems with your CONCENTRATION as you have described?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Less than 2 weeks" },
            { content: 2, label: "Between 2 weeks and 6 months" },
            { content: 3, label: "Between 6 months and 1 year" },
            { content: 4, label: "Between 1 and 2 years" },
            { content: 5, label: "Between 2 and 5 years" },
            { content: 6, label: "More than 5 years" },
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
      question: "Have you forgotten anything important in the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes, I have forgotten something important" },
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
      question:
        "How long have you been having problems with your MEMORY as you have described?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Less than 2 weeks" },
            { content: 2, label: "Between 2 weeks and 6 months" },
            { content: 3, label: "Between 6 months and 1 year" },
            { content: 4, label: "Between 1 and 2 years" },
            { content: 5, label: "Between 2 and 5 years" },
            { content: 6, label: "More than 5 years" },
          ],
        },
      ],
      next_item: "sleep-loss",
    }),
    new Item({
      id: "sleep-loss",
      question:
        "In the PAST MONTH, have you been having problems with trying to get to sleep or with getting back to sleep if you woke up or were woken up?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "On how many nights in the SEVEN NIGHTS did you have problems with your sleep?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "None" },
            { content: 2, label: "Between one and three nights" },
            { content: 3, label: "Four nights or more" },
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
      question:
        "Thinking about the night you had the LEAST sleep in the PAST WEEK, how long did you spend trying to get to sleep?\n\nOnly include time spent lying awake in bed TRYING to return to sleep.",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Less than 15 minutes" },
            { content: 2, label: "Between 15 minutes and 1 hour" },
            { content: 3, label: "Between 1 and 3 hours" },
            { content: 4, label: "Three hours or more" },
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
      question:
        "In the PAST SEVEN DAYS, how many nights did you spend 3 or more hours trying to get to sleep?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "None" },
            { content: 2, label: "Between one and three nights" },
            { content: 3, label: "Four nights or more" },
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
      question:
        "In the PAST SEVEN DAYS, have you woken more than two hours earlier than you needed to and found that you couldn't get back to sleep?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes, and I couldn't get back to sleep" },
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
      question: "What are your sleep difficulties caused by?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Noises (babies crying, busy roads etc.)" },
            { content: 2, label: "Shift work or late nights" },
            { content: 3, label: "Pain or illness" },
            { content: 4, label: "Worries" },
            { content: 5, label: "Reason not known" },
            { content: 6, label: "Other" },
          ],
        },
      ],
      next_item: "sleep-duration",
    }),
    new Item({
      id: "sleep-gain",
      question:
        "Has sleeping more than usual been a problem for you in the PAST MONTH?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            {
              content: 2,
              label: "I have slept more than usual but this is not a problem",
            },
            { content: 3, label: "Yes" },
          ],
        },
      ],
      next_item_fun: (last_changed_answer: any) =>
        last_changed_answer !== 3 ? "irritability" : "sleep-gain-frequency",
    }),
    new Item({
      id: "sleep-gain-frequency",
      question:
        "On how many nights in the SEVEN NIGHTS did you have problems with your sleep?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "None" },
            { content: 2, label: "Between one and three nights" },
            { content: 3, label: "Four nights or more" },
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
      question:
        "Thinking about the night you slept the longest in the PAST SEVEN DAYS, how much longer did you sleep compared with how long you normally sleep for?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Less than 15 minutes" },
            { content: 2, label: "Between 15 minutes and 1 hour" },
            { content: 3, label: "Between 1 and 3 hours" },
            { content: 4, label: "Three hours or more" },
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
      question:
        "In the PAST SEVEN DAYS, on how many nights did you sleep for more than 3 hours longer usual?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "None" },
            { content: 2, label: "Between one and three nights" },
            { content: 3, label: "Four nights or more" },
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
      question:
        "How long have you had these problems with your sleep as you have described?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Less than 2 weeks" },
            { content: 2, label: "Between 2 weeks and 6 months" },
            { content: 3, label: "Between 6 months and 1 year" },
            { content: 4, label: "Between 1 and 2 years" },
            { content: 5, label: "Between 2 and 5 years" },
            { content: 6, label: "More than 5 years" },
          ],
        },
      ],
      next_item: "irritability",
    }),
    new Item({
      id: "irritability",
      question:
        "Many people become irritable or short tempered at times, though they may not show it.\n\nHave you felt irritable or short tempered with those around you in the PAST MONTH?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            {
              content: 2,
              label: "Yes, I have felt irritable or short tempered recently",
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
      question:
        "During the PAST MONTH, did you get short tempered or angry over things which now seem trivial when you look back on them?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Sometimes" },
            { content: 3, label: "Yes" },
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
      question:
        "On how many days have you felt irritable, short tempered or angry in the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "None" },
            { content: 2, label: "Between one and three days" },
            { content: 3, label: "Four days or more" },
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
      question:
        "In total, have you felt irritable, short tempered or angry for more than one hour on any day in the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            {
              content: 2,
              label:
                "Yes, I felt this way for more than one hour on at least one day",
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
      question:
        "During the PAST SEVEN DAYS, have you felt so irritable, short tempered or angry that you have wanted to shout at someone, even if you haven't actually shouted?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            {
              content: 2,
              label: "Yes, but I didn't actually shout at someone",
            },
            { content: 3, label: "Yes, and I actually shouted" },
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
      question:
        "In the past SEVEN DAYS, have you had arguments, rows or quarrels or lost your temper with anyone?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes, but this was justified" },
            { content: 3, label: "Yes" },
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
      question:
        "How long have you been feeling irritable, short-tempered or angry as you have described?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Less than 2 weeks" },
            { content: 2, label: "Between 2 weeks and 6 months" },
            { content: 3, label: "Between 6 months and 1 year" },
            { content: 4, label: "Between 1 and 2 years" },
            { content: 5, label: "Between 2 and 5 years" },
            { content: 6, label: "More than 5 years" },
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
      question:
        "Many people get concerned about their physical health. In the PAST MONTH have you been at all worried about your physical health?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "Do you find yourself worrying that you might have a serious illness like cancer, heart disease or AIDS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "Thinking about the PAST SEVEN DAYS, on how many days have you found yourself worrying about your physical health, or worrying that you might have a serious physical illness?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "None" },
            { content: 2, label: "Between one and three days" },
            { content: 3, label: "Four days or more" },
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
      question:
        "In your opinion, have you been worrying too much in view of your actual physical health?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes, I worry too much" },
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
      question: "How unpleasant has this worrying been in the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Not at all" },
            { content: 2, label: "A little unpleasant" },
            { content: 3, label: "Unpleasant" },
            { content: 4, label: "Very unpleasant" },
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
      question:
        "In the PAST SEVEN DAYS, have you been able to take your mind off your health worries at least once, by doing something else?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Yes" },
            {
              content: 2,
              label: "No, I could not take my mind off these worries even once",
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
      question:
        "How long have you been worrying about your physical health in the way you have described?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Less than 2 weeks" },
            { content: 2, label: "Between 2 weeks and 6 months" },
            { content: 3, label: "Between 6 months and 1 year" },
            { content: 4, label: "Between 1 and 2 years" },
            { content: 5, label: "Between 2 and 5 years" },
            { content: 6, label: "More than 5 years" },
          ],
        },
      ],
      next_item: "depression",
    }),
    new Item({
      id: "depression",
      question:
        "Almost everyone becomes low in mood or depressed at times.\n\nHave you had a spell of feeling sad, miserable or depressed in the PAST MONTH?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS, have you had a spell of feeling sad, miserable or depressed?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No, not in the past week" },
            { content: 2, label: "Yes" },
          ],
        },
      ],
      next_item: "depression-enjoy",
    }),
    new Item({
      id: "depression-enjoy",
      question:
        "During the PAST MONTH, have you been able to enjoy or take an interest in things as much as you usually do?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Yes" },
            { content: 2, label: "No, less enjoyment than usual" },
            { content: 3, label: "No, I don't enjoy anything" },
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
      question:
        "In the PAST SEVEN DAYS, have you been able to enjoy or take an interest in things as much as usual?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Yes" },
            { content: 2, label: "No, less enjoyment than usual" },
            { content: 3, label: "No, I don't enjoy anything" },
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
      question:
        "In the PAST SEVEN DAYS, on how many days have you felt sad, miserable or depressed OR unable to enjoy or take an interest in things?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "None" },
            { content: 2, label: "Between one and three days" },
            { content: 3, label: "Four days or more" },
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
      question:
        "Have you felt sad, miserable or depressed OR unable to enjoy or take an interest in things for more than 3 hours in total on any day in the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No, less than 3 hours" },
            {
              content: 2,
              label: "Yes, for 3 hours or more on at least one day",
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
      question:
        "What is the MAIN thing that made you feel sad, miserable or depressed OR unable to enjoy or take an interest in things in the PAST WEEK?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            {
              content: 1,
              label: "Family members, including spouse or partner",
            },
            {
              content: 2,
              label: "Relationships with friends or people at work",
            },
            { content: 3, label: "Housing" },
            { content: 4, label: "Money or bills" },
            {
              content: 5,
              label: "Your own physical health, including pregnancy",
            },
            { content: 6, label: "Your own mental health" },
            { content: 7, label: "Work or lack of work (including studying)" },
            { content: 8, label: "Legal difficulties" },
            { content: 9, label: "Political issues or the news" },
          ],
        },
      ],
      next_item: "depression-company",
    }),
    new Item({
      id: "depression-company",
      question:
        "In the PAST SEVEN DAYS when you felt sad, miserable or depressed OR unable to enjoy or take an interest in things, did you ever become happier when something nice happened, or when you were in company?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Yes, always" },
            { content: 2, label: "Sometimes I cheered up" },
            { content: 3, label: "No, nothing cheered me up" },
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
      question:
        "How long have you been feeling sad, miserable or depressed OR unable to enjoy or take an interest in things as you have described?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Less than 2 weeks" },
            { content: 2, label: "Between 2 weeks and 6 months" },
            { content: 3, label: "Between 6 months and 1 year" },
            { content: 4, label: "Between 1 and 2 years" },
            { content: 5, label: "Between 2 and 5 years" },
            { content: 6, label: "More than 5 years" },
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
      question:
        "I would now like to ask you about when you have been feeling sad, miserable or depressed OR unable to enjoy or take an interest in things.\n\nIn the PAST SEVEN DAYS, was this worse in the morning, in the evening, or did this make no difference?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Worse in the morning" },
            { content: 2, label: "Worse in the evening" },
            {
              content: 3,
              label: "Sometimes worse in the morning sometimes in the evening",
            },
            { content: 4, label: "No difference between morning and evening" },
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
      question:
        "Many people find that feeling sad, miserable or depressed, OR unable to enjoy or take an interest in things can affect their interest in sex.\n\nOver the PAST MONTH, do you think your interest in sex has increased, decreased or stayed the same?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Not applicable" },
            { content: 2, label: "No change" },
            { content: 3, label: "Increased" },
            { content: 4, label: "Decreased" },
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
      question:
        "In the PAST SEVEN DAYS, when you have felt sad, miserable or depressed OR unable to enjoy or take an interest in things have you been so restless that you couldn't sit still?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS, when you have felt sad, miserable or depressed OR unable to enjoy or take an interest in things have you been doing things more slowly than usual, for example walking more slowly?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS have you on at least one occasion felt guilty or blamed yourself when things went wrong, even when it hasn't been your fault?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Never" },
            { content: 2, label: "Only when it was my fault" },
            { content: 3, label: "Sometimes" },
            { content: 4, label: "Often" },
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
      question:
        "In the PAST SEVEN DAYS have you been feeling you are not as good as other people?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            {
              content: 1,
              label: "No, I've been feeling as good as anyone else",
            },
            {
              content: 2,
              label: "Yes, I've NOT been feeling as good as others",
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
      question:
        "Have you felt hopeless at all during the PAST SEVEN DAYS, for instance about your future?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes, I have felt hopeless sometimes" },
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
      question:
        "In the PAST SEVEN DAYS, have you felt that life isn't worth living?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Sometimes" },
            { content: 3, label: "Always" },
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
      question: "In the PAST SEVEN DAYS, have you thought of killing yourself?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes, but I would never commit suicide" },
            {
              content: 3,
              label: "Yes, I have had thoughts about it in the past week",
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
      question:
        "In the PAST SEVEN DAYS, have you thought about a way in which you might kill yourself?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "Have you talked to your doctor about these thoughts of killing yourself?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Yes" },
            { content: 2, label: "No, but I have talked to other people" },
            { content: 3, label: "No" },
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
      question:
        "You have said that you are thinking about committing suicide.\n\nThis is a very serious matter. It is important you talk to your doctor about these thoughts.",
      next_item: "depression-outro",
    }),
    new Item({
      id: "depression-outro",
      question:
        "Thank you for answering those questions on feeling unhappy or depressed.\n\nThe next section is about worrying and anxiety.",
      next_item: "worry",
    }),
    new Item({
      id: "worry",
      question:
        "In the PAST MONTH, did you find yourself worrying more than you needed to about things?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Sometimes" },
            { content: 3, label: "Often" },
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
      question: "Have you had any worries at all in the PAST MONTH?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "What is the MAIN thing you have been worried about in the PAST WEEK?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            {
              content: 1,
              label: "Family members, including spouse or partner",
            },
            {
              content: 2,
              label: "Relationships with friends or with people at work",
            },
            { content: 3, label: "Housing" },
            { content: 4, label: "Money or bills" },
            {
              content: 5,
              label: "Your own physical health, including pregnancy",
            },
            { content: 6, label: "Your own mental health" },
            { content: 7, label: "Work or lack of work (including studying)" },
            { content: 8, label: "Legal difficulties" },
            { content: 9, label: "Political issues or the news" },
          ],
        },
      ],
      next_item: "worry-intro",
    }),
    new Item({
      id: "worry-intro",
      question:
        "The next few questions are about the worries you have had OTHER than those about your physical health.",
      next_item: "worry-frequency",
    }),
    new Item({
      id: "worry-frequency",
      question:
        "On how many of the PAST SEVEN DAYS have you been worrying about things OTHER than your physical health?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "None" },
            { content: 2, label: "Between one and three days" },
            { content: 3, label: "Four days or more" },
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
      question:
        "In your opinion, have you been worrying too much in view of your circumstances?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes, worrying too much" },
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
      question:
        "How unpleasant has your worrying been about things OTHER than your physical health in the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Not at all" },
            { content: 2, label: "A little unpleasant" },
            { content: 3, label: "Unpleasant" },
            { content: 4, label: "Very unpleasant" },
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
      question:
        "Have you worried about something OTHER than your physical health for more than three hours in total on any day in the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No, Less than 3 hours" },
            {
              content: 2,
              label: "Yes, 3 hours or more on at least one day this week",
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
      question:
        "How long have you been worrying about things OTHER than your physical health in the way that you have described?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Less than 2 weeks" },
            { content: 2, label: "Between 2 weeks and 6 months" },
            { content: 3, label: "Between 6 months and 1 year" },
            { content: 4, label: "Between 1 and 2 years" },
            { content: 5, label: "Between 2 and 5 years" },
            { content: 6, label: "More than 5 years" },
          ],
        },
      ],
      next_item: "anxiety",
    }),
    new Item({
      id: "anxiety",
      question: "Have you been feeling anxious or nervous in the PAST MONTH?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST MONTH, did you ever find your muscles felt tense or that you couldn't relax?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Sometimes" },
            { content: 3, label: "Often" },
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
      question:
        "Some people have phobias; they get anxious, nervous or tense about specific things or situations when there is no real danger. For example, they may get nervous when speaking or eating in front of strangers, when they are far from home or in crowded rooms, or they may have a fear of heights. Others get nervous at the sight of things like blood or spiders.\n\nIn the PAST MONTH, have you felt anxious, nervous or tense about any specific things or situations when there was no real danger?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST MONTH, when you have felt anxious, nervous or tense was this ALWAYS brought on by the phobia about some SPECIFIC thing or did you sometimes feel GENERALLY anxious, nervous or tense?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            {
              content: 1,
              label: "These feelings were ALWAYS brought on by specific phobia",
            },
            {
              content: 2,
              label: "I sometimes felt generally anxious, nervous or tense",
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
      question:
        "The next questions are concerned with GENERAL anxiety, nervousness or tension ONLY. Questions about the anxiety which is brought on by the phobia(s) about specific things or situations will be asked later.",
      next_item: "anxiety-frequency",
    }),
    new Item({
      id: "anxiety-frequency",
      question:
        "On how many of the PAST SEVEN DAYS have you felt GENERALLY anxious, nervous or tense?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "None" },
            { content: 2, label: "Between one and three days" },
            { content: 3, label: "Four days or more" },
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
      question:
        "How unpleasant has your anxiety, nervousness or tension been in the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Not at all" },
            { content: 2, label: "A little unpleasant" },
            { content: 3, label: "Unpleasant" },
            { content: 4, label: "Very unpleasant" },
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
      question:
        "In the PAST SEVEN DAYS, when you've been anxious, nervous or tense, have you had the following symptom:\n\nYour heart racing or pounding?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS, when you've been anxious, nervous or tense, have you had the following symptom:\n\nFeeling dizzy?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS, when you've been anxious, nervous or tense, have you had the following symptom:\n\nAbdominal discomfort or feeling like you were going to vomit?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS, when you've been anxious, nervous or tense, have you had the following symptom:\n\nHands sweating or shaking?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS, when you've been anxious, nervous or tense, have you had the following symptom:\n\nDifficulty getting breath?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS, when you've been anxious, nervous or tense, have you had the following symptom:\n\nDry mouth?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS, when you've been anxious, nervous or tense, have you had the following symptom:\n\nChest pain?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS, when you've been anxious, nervous or tense, have you had the following symptom:\n\nNumbness or tingling in hands or feet?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "Have you felt anxious, nervous or tense for more than 3 hours in total on any day in the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes, more than 3 hours on at least one day" },
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
      question:
        "How long have you had these feelings of general anxiety, nervousness or tension, as you have described?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Less than 2 weeks" },
            { content: 2, label: "Between 2 weeks and 6 months" },
            { content: 3, label: "Between 6 months and 1 year" },
            { content: 4, label: "Between 1 and 2 years" },
            { content: 5, label: "Between 2 and 5 years" },
            { content: 6, label: "More than 5 years" },
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
      question:
        "Sometimes people  AVOID  a specific situation or thing because they have a phobia about it. For instance, some people avoid eating in public or avoid going to busy places because it would make them feel nervous or anxious.\n\nIn the PAST MONTH, have you  AVOIDED  any situation or thing because it would have made you feel nervous or anxious, even though there was no real danger?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "Here is a list of things that some people feel nervous about.\n\nWhich one of these are you MOST afraid of?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Travelling alone by bus or train" },
            { content: 2, label: "Being far from home" },
            { content: 3, label: "Eating or speaking in front of strangers" },
            { content: 4, label: "The sight of blood" },
            { content: 5, label: "Going into crowded shops" },
            { content: 6, label: "Insects, spiders or animals" },
            { content: 7, label: "Being watched or stared at" },
            { content: 8, label: "Enclosed spaces or heights" },
            {
              content: 9,
              label:
                "I am not frightened of anything on this list but I am frightened of something else",
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
      question:
        "On how many of the PAST SEVEN DAYS have you felt nervous or anxious about the situation or thing you are most frightened of?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "None" },
            { content: 2, label: "Between one and three days" },
            { content: 3, label: "Four days or more" },
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
      question:
        "In the PAST SEVEN DAYS, on those occasions when you felt anxious, nervous or tense about this, have you had the following symptom:\n\nYour heart racing or pounding?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS, on those occasions when you felt anxious, nervous or tense about this have you had the following symptom:\n\nFeeling dizzy?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS, on those occasions when you felt anxious, nervous or tense about this have you had the following symptom:\n\nAbdominal discomfort or feeling like you were going to vomit?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS, on those occasions when you felt anxious, nervous or tense about this have you had the following symptom:\n\nHands sweating or shaking?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS, on those occasions when you felt anxious, nervous or tense about this have you had the following symptom:\n\nDifficulty getting breath?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS, on those occasions when you felt anxious, nervous or tense about this have you had the following symptom:\n\nDry mouth?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS, on those occasions when you felt anxious, nervous or tense about this have you had the following symptom:\n\nChest pain?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS, on those occasions when you felt anxious, nervous or tense about this have you had the following symptom:\n\nNumbness or tingling in hands or feet?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS, have you AVOIDED any situations or things because it would have made you feel anxious, nervous or tense, even though there was no real danger?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes, on one or more occasion" },
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
      question:
        "How many times have you avoided such situations or things in the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "None" },
            { content: 2, label: "Between one and three times" },
            { content: 3, label: "Four times or more" },
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
      question:
        "How long have you been having these feelings about the situations or things as you have just described?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Less than 2 weeks" },
            { content: 2, label: "Between 2 weeks and 6 months" },
            { content: 3, label: "Between 6 months and 1 year" },
            { content: 4, label: "Between 1 and 2 years" },
            { content: 5, label: "Between 2 and 5 years" },
            { content: 6, label: "More than 5 years" },
          ],
        },
      ],
      next_item_fun: (ans, item, state) => panic_navigation(state),
    }),
    new Item({
      id: "panic",
      question:
        "Thinking about the PAST MONTH, did your anxiety or tension ever get so bad that you got in a panic, for instance make you feel that you might collapse or lose control unless you did something about it?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No, my anxiety never got that bad" },
            { content: 2, label: "Yes, sometimes" },
            { content: 3, label: "Yes, often" },
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
      question: "How often has this panic happened in the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Not in the past seven days" },
            { content: 2, label: "Once" },
            { content: 3, label: "More than once" },
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
      question:
        "In the PAST SEVEN DAYS, how unpleasant have these feelings of panic been?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "A little uncomfortable" },
            { content: 2, label: "Unpleasant" },
            { content: 3, label: "Unbearable, or very unpleasant" },
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
      question:
        "In the PAST SEVEN DAYS, did the worst of these panics last for longer than 10 minutes?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Less than 10 minutes" },
            { content: 2, label: "10 minutes or more" },
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
      question:
        "Do these panics start suddenly so you are at maximum anxiety within a few minutes?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
          ],
        },
      ],
      next_item: "panic-heart",
    }),
    new Item({
      id: "panic-heart",
      question:
        "In the PAST SEVEN DAYS when you had these panics:\n\nDid your heart beat harder or speed up?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS when you had these panics:\n\nDid you have sweaty or clammy hands?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS when you had these panics:\n\nWere you trembling or shaking?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS when you had these panics:\n\nDid you have shortness of breath or difficulty breathing?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS when you had these panics:\n\nDid you have a choking sensation?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS when you had these panics:\n\nDid you have pain, pressure or discomfort in your chest?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS when you had these panics:\n\nDid you have abdominal discomfort or feel like you were going to vomit?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS when you had these panics:\n\nDid you feel dizzy, unsteady, lightheaded or faint?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS when you had these panics:\n\nDid things around you feel strange, unreal or detached  OR  did you feel outside or detached from yourself?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS when you had these panics:\n\nDid you fear that you were losing control or going crazy?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS when you had these panics:\n\nDid you fear that you were dying?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS when you had these panics:\n\nDid you have tingling or numbness in parts of your body?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "In the PAST SEVEN DAYS when you had these panics:\n\nDid you have hot flushes or chills?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
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
      question:
        "Is this panic ALWAYS brought on by specific situations or things?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Yes" },
          ],
        },
      ],
      next_item: "panic-duration",
    }),
    new Item({
      id: "panic-duration",
      question:
        "How long have you been having these feelings of panic as you have described?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Less than 2 weeks" },
            { content: 2, label: "Between 2 weeks and 6 months" },
            { content: 3, label: "Between 6 months and 1 year" },
            { content: 4, label: "Between 1 and 2 years" },
            { content: 5, label: "Between 2 and 5 years" },
            { content: 6, label: "More than 5 years" },
          ],
        },
      ],
      next_item: "anxiety-outro",
    }),
    new Item({
      id: "anxiety-outro",
      question: "Thank you for answering those questions on anxiety and worry.",
      next_item: "compulsions",
    }),
    new Item({
      id: "compulsions",
      question:
        "In the PAST MONTH, did you find that you kept on doing things over and over again when you knew you had already done them, for instance checking things like taps, or washing yourself when you had already done so?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Sometimes" },
            { content: 3, label: "Often" },
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
      question:
        "On how many days in the PAST SEVEN DAYS did you find yourself doing things over again that you had already done?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "None" },
            { content: 2, label: "Between one and three days" },
            { content: 3, label: "Four days or more" },
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
      question:
        "During the PAST SEVEN DAYS, have you tried to stop yourself repeating things over again?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No, not in the past week" },
            { content: 2, label: "Yes, on at least one occasion" },
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
      question:
        "Has repeating things over again made you upset or annoyed with yourself in the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Not at all" },
            { content: 2, label: "Yes, it has upset or annoyed me" },
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
      question:
        "In the PAST SEVEN DAYS, what is the GREATEST NUMBER of times you repeated something you had already done?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Once (ie 2 times altogether)" },
            { content: 2, label: "Two repeats" },
            { content: 3, label: "Three or more repeats" },
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
      question:
        "How long have you been repeating things that you have already done in the way you have described?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Less than 2 weeks" },
            { content: 2, label: "Between 2 weeks and 6 months" },
            { content: 3, label: "Between 6 months and 1 year" },
            { content: 4, label: "Between 1 and 2 years" },
            { content: 5, label: "Between 2 and 5 years" },
            { content: 6, label: "More than 5 years" },
          ],
        },
      ],
      next_item: "obsessions",
    }),
    new Item({
      id: "obsessions",
      question:
        "In the PAST MONTH, did you have any thoughts or ideas over and over again that you found unpleasant and would prefer not to think about, that still kept coming into your mind?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No" },
            { content: 2, label: "Sometimes" },
            { content: 3, label: "Often" },
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
      question:
        "Are these the SAME thoughts or ideas over and over again, or are you worrying about something in GENERAL?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            {
              content: 1,
              label: "The same thoughts or ideas over and over again",
            },
            { content: 2, label: "Worrying about something in general" },
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
      question:
        "On how many days in the PAST SEVEN DAYS have you had these unpleasant thoughts?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "None" },
            { content: 2, label: "Between one and three days" },
            { content: 3, label: "Four days or more" },
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
      question:
        "During the PAST SEVEN DAYS, have you tried to stop yourself thinking any of these thoughts?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "No, not in the past week" },
            {
              content: 2,
              label: "Yes, I have tried to stop these thoughts at least once",
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
      question:
        "Have you become upset or annoyed with yourself when you have had these thoughts in the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Not at all" },
            {
              content: 2,
              label: "Yes, they have upset or annoyed me in the past week",
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
      question:
        "What is the longest time you have spent thinking these thoughts, in the PAST SEVEN DAYS?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Less than fifteen minutes" },
            { content: 2, label: "Fifteen minutes or more" },
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
      question:
        "How long have you been having these thoughts in the way which you have described?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Less than 2 weeks" },
            { content: 2, label: "Between 2 weeks and 6 months" },
            { content: 3, label: "Between 6 months and 1 year" },
            { content: 4, label: "Between 1 and 2 years" },
            { content: 5, label: "Between 2 and 5 years" },
            { content: 6, label: "More than 5 years" },
          ],
        },
      ],
      next_item_fun: (ans, item, state) => _overall_navigation(state),
    }),
    new Item({
      id: "overall-follow-up",
      question:
        "How have ALL of these things that you have told me about affected you overall?\n\nIn the PAST SEVEN DAYS, has the way you have been feeling actually STOPPED you from getting on with the tasks and activities you used to do or would like to do?",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { content: 1, label: "Not at all" },
            {
              content: 2,
              label:
                "They have made things more difficult but I get everything done",
            },
            { content: 3, label: "They have stopped one activity" },
            { content: 4, label: "They have stopped more than one activity" },
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
          const a: any = i.answer.raw_content;
          const ans: { content: any; label?: string } =
            typeof a === "number"
              ? { content: a }
              : { content: a.content, label: a.label };
          return {
            id: i.id,
            question: i.question,
            answer: ans,
          };
        }),
      datetime: now.toUTCString(),
    };
  },
};

_state_properties.items
  .filter(i => i.answers?.length === 1)
  // @ts-ignore
  .map((i) => i.answer)
  .forEach(
    (a) =>
      // @ts-ignore
      (a.check_answer_fun = (a) =>
        typeof a.content === "undefined"
          ? ["This question requires an answer"]
          : [])
  );

export const questionnaire: () => Questionnaire = () =>
  new Questionnaire(_state_properties);
