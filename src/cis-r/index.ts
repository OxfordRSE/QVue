import { ItemType } from "@/cis-r/types";
import { State, Item } from "@/cis-r/classes";

export * from "@/cis-r/classes";
export * from "@/cis-r/types";

export const state: State = new State({
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
      answer_options: [
        { value: 1, text: "Male" },
        { value: 2, text: "Female" },
      ],
      next_item: "demo-age",
    }),
    new Item({
      id: "demo-age",
      question: "How old are you?",
      type: ItemType.NUMBER,
      next_item: "demo-marital",
    }),
    new Item({
      id: "demo-marital",
      question: "What is your marital status?",
      answer_options: [
        { value: 1, text: "Married/Living as married" },
        { value: 2, text: "Single" },
        { value: 3, text: "Separated" },
        { value: 4, text: "Divorced" },
        { value: 5, text: "Widowed" },
      ],
      next_item: "demo-employment",
    }),
    new Item({
      id: "demo-employment",
      question: "What is your current employment status?",
      answer_options: [
        { value: 1, text: "Employed full-time" },
        { value: 2, text: "Employed part-time" },
        { value: 3, text: "Studying at school, college or university" },
        { value: 4, text: "Retired" },
        { value: 5, text: "Houseperson" },
        { value: 6, text: "Unemployed job seeker" },
        { value: 7, text: "Unemployed due to ill-health" },
        {
          value: 8,
          text: "On a government or other employment training scheme",
        },
      ],
      next_item: "demo-housing",
    }),
    new Item({
      id: "demo-housing",
      question: "What is your housing situation?",
      answer_options: [
        { value: 1, text: "Home owner" },
        { value: 2, text: "Renting" },
        { value: 3, text: "Living with relative or friend" },
        { value: 4, text: "Hostel or care home" },
        { value: 5, text: "Homeless" },
        { value: 6, text: "Other" },
      ],
      next_item: "health-intro",
    }),
    new Item({
      id: "health-intro",
      question: "I would now like to ask you about your health and well-being",
    }),
    new Item({
      id: "health-appetite-loss",
      question:
        "Have you noticed a marked LOSS in your appetite in the PAST MONTH?",
      answer_options: [
        { value: 1, text: "No" },
        { value: 2, text: "Yes" },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 2) {
          state.counters.increment("depression-criterion-3", 1);
          state.counters.set("weight-change", 1);
        }
      },
      next_item_fun: (ans) =>
        ans?.value === 2 ? "weight-loss" : "appetite-gain",
    }),
    new Item({
      id: "health-weight-loss",
      question: "Have you lost any weight in the PAST MONTH?",
      answer_options: [
        { value: 1, text: "No" },
        { value: 2, text: "Yes" },
      ],
      next_item_fun: (ans) =>
        ans?.value === 2 ? "health-weight-loss-diet" : "health-gp-visits",
    }),
    new Item({
      id: "health-weight-loss-diet",
      question: "Were you trying to lose weight or on a diet?",
      answer_options: [
        { value: 1, text: "No, I was not trying to lose weight" },
        { value: 2, text: "Yes, I have been trying to lose weight" },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 1) {
          state.counters.set("weight-change", 2);
        }
      },
      next_item_fun: (ans) =>
        ans?.value === 1 ? "health-weight-loss-amount" : "health-gp-visits",
    }),
    new Item({
      id: "health-weight-loss-amount",
      question:
        "Did you lose half a stone or more, or did you lose less than this (in the PAST MONTH)?\n\n(NOTE: Half a stone = 7 pounds or 3 kg)",
      answer_options: [
        { value: 1, text: "I lost half a stone or more" },
        { value: 2, text: "I lost less than half a stone" },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 1) {
          state.counters.increment("depression-criterion-3", 1);
          state.counters.set("weight-change", 3);
        }
      },
      next_item: "health-gp-visits",
    }),
    new Item({
      id: "health-appetite-gain",
      question:
        "Have you noticed a marked INCREASE in your appetite in the PAST MONTH?",
      answer_options: [
        { value: 1, text: "No" },
        { value: 2, text: "Yes" },
      ],
      next_item_fun: (ans, state) => {
        if (ans?.value === 1) return "health-gp-visits";
        if (ans?.value === 2) {
          const sex_ans = state.getItemById("demo-sex").answer?.value;
          if (typeof sex_ans === "number")
            return sex_ans === 1
              ? "health-weight-gain-male"
              : "health-weight-gain-female";
        }
        throw `Could not determine next question for ${state.current_item?.id}`;
      },
    }),
    new Item({
      id: "health-weight-gain-male",
      question: "Have you lost any weight in the PAST MONTH?",
      answer_options: [
        { value: 1, text: "No" },
        { value: 2, text: "Yes" },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 2) {
          state.counters.set("weight-change", 2);
        }
      },
      next_item_fun: (ans) =>
        ans?.value === 2 ? "health-weight-gain-amount" : "health-gp-visits",
    }),
    new Item({
      id: "health-weight-gain-female",
      question: "Have you lost any weight in the PAST MONTH?",
      answer_options: [
        { value: 1, text: "No" },
        { value: 2, text: "Yes" },
        { value: 23, text: "Yes, but I am pregnant" },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 2) {
          state.counters.set("weight-change", 2);
        }
      },
      next_item_fun: (ans) =>
        ans?.value === 2 ? "health-weight-gain-amount" : "health-gp-visits",
    }),
    new Item({
      id: "health-weight-gain-amount",
      question:
        "Did you gain half a stone or more, or did you gain less than this (in the PAST MONTH)?\n\n(NOTE: Half a stone = 7 pounds or 3 kg)",
      answer_options: [
        { value: 1, text: "I gained half a stone or more" },
        { value: 2, text: "I gained less than half a stone" },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 1 && state.counters.get("weight-change") === 2) {
          state.counters.set("weight-change", 4);
        }
      },
      next_item: "health-gp-visits",
    }),
    new Item({
      id: "health-gp-visits",
      question:
        "In the PAST YEAR, approximately how many times have you talked to or visited a GP or family doctor about your OWN health? Do NOT include any visits to hospital.",
      answer_options: [
        { value: 0, text: "None" },
        { value: 1, text: "1 or 2 times" },
        { value: 2, text: "3 to 5 times" },
        { value: 3, text: "6 to 10 times" },
        { value: 4, text: "More than 10 times" },
      ],
      process_answer_fun: (ans, state) => {
        if (
          state.counters.get("weight-change") === 3 &&
          state.getItemById("health-appetite-loss").answer?.value === 2
        )
          state.counters.increment("depression-criterion-2", 1);
        if (
          state.counters.get("weight-change") === 4 &&
          state.getItemById("health-appetite-gain").answer?.value === 2
        )
          state.counters.increment("depression-criterion-2", 1);
      },
      next_item: "health-disability",
    }),
    new Item({
      id: "health-disability",
      question:
        "Do you have any long-standing illness, disability or infirmity?\n\nLong-standing means anything that has troubled you over a period of time or that is likely to affect you over a period of time",
      answer_options: [
        { value: 1, text: "No" },
        { value: 2, text: "Yes" },
      ],
      next_item: "health-illness",
    }),
    new Item({
      id: "health-illness",
      question:
        "Do you have any of the following conditions? If you have more than one condition answer for the most serious condition.",
      answer_options: [
        { value: 1, text: "Diabetes" },
        { value: 2, text: "Asthma or COPD" },
        { value: 3, text: "Arthritis" },
        { value: 4, text: "Heart disease or heart problems" },
        { value: 5, text: "Stroke" },
        { value: 6, text: "Cancer" },
        { value: 7, text: "Kidney disease" },
        { value: 8, text: "Mental health problems" },
        { value: 9, text: "None of the above" },
      ],
      next_item: "somatic-pain",
    }),
    new Item({
      id: "somatic-pain",
      question:
        "Have you had ANY sort of aches or pains in the PAST MONTH, including headaches or indigestion?",
      answer_options: [
        { value: 1, text: "No" },
        { value: 2, text: "Yes" },
      ],
      next_item_fun: (ans) =>
        ans?.value === 1 ? "somatic-discomfort" : "somatic-stress",
    }),
    new Item({
      id: "somatic-stress",
      question:
        "Was this pain or ache BROUGHT ON or MADE WORSE because you were feeling low, anxious or stressed?",
      answer_options: [
        { value: 1, text: "Never" },
        { value: 2, text: "Sometimes" },
        { value: 3, text: "Always" },
      ],
      next_item_fun: (ans) =>
        ans?.value === 1 ? "somatic-discomfort" : "somatic-pain-freqency",
    }),
    new Item({
      id: "somatic-pain-frequency",
      question:
        "On how many days have you noticed this pain during the PAST SEVEN DAYS?",
      answer_options: [
        { value: 1, text: "None" },
        { value: 2, text: "Between one and three days" },
        { value: 3, text: "Four days or more" },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 3) state.counters.increment("somatic", 1);
      },
      next_item_fun: (ans) =>
        ans?.value === 1 ? "somatic-discomfort" : "somatic-pain-duration",
    }),
    new Item({
      id: "somatic-pain-duration",
      question:
        "In total, did the pain or ache last for more than 3 hours on ANY day during the PAST SEVEN DAYS?",
      answer_options: [
        { value: 1, text: "No, less than 3 hours" },
        {
          value: 2,
          text: "Yes, it has lasted for more than 3 hours on at least one day",
        },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 2) state.counters.increment("somatic", 1);
      },
      next_item: "somatic-pain-valence",
    }),
    new Item({
      id: "somatic-pain-valence",
      question: "Has the pain been unpleasant in the PAST SEVEN DAYS?",
      answer_options: [
        { value: 1, text: "Not at all" },
        { value: 2, text: "A little unpleasant" },
        { value: 3, text: "Unpleasant" },
        { value: 4, text: "Very unpleasant" },
      ],
      process_answer_fun: (ans, state) => {
        if (typeof ans?.value === "number" && ans?.value >= 3)
          state.counters.increment("somatic", 1);
      },
      next_item: "somatic-pain-distress",
    }),
    new Item({
      id: "somatic-pain-distress",
      question:
        "Has the pain bothered you when you were doing something interesting in the PAST SEVEN DAYS?",
      answer_options: [
        { value: 1, text: "No, pain has not bothered me" },
        {
          value: 2,
          text: "Yes, pain bothered me while doing something interesting",
        },
        {
          value: 3,
          text: "I haven't done anything interesting in the past week",
        },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 2) state.counters.increment("somatic", 1);
      },
      next_item: "somatic-duration",
    }),
    new Item({
      id: "somatic-discomfort",
      question:
        "Have you been troubled by any sort of bodily discomfort in THE PAST MONTH?",
      answer_options: [
        { value: 1, text: "No" },
        { value: 2, text: "Yes" },
      ],
      next_item_fun: (ans) =>
        ans?.value === 1 ? "fatigue" : "somatic-discomfort-stress",
    }),
    new Item({
      id: "somatic-discomfort-stress",
      question:
        "Was this discomfort BROUGHT ON or MADE WORSE because you were feeling low, anxious or stressed?",
      answer_options: [
        { value: 1, text: "Never" },
        { value: 2, text: "Sometimes" },
        { value: 3, text: "Always" },
      ],
      next_item_fun: (ans) =>
        ans?.value === 1 ? "fatigue" : "somatic-discomfort-freqency",
    }),
    new Item({
      id: "somatic-discomfort-frequency",
      question:
        "On how many days have you noticed this discomfort during the PAST SEVEN DAYS?",
      answer_options: [
        { value: 1, text: "None" },
        { value: 2, text: "Between one and three days" },
        { value: 3, text: "Four days or more" },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 3) state.counters.increment("somatic", 1);
      },
      next_item_fun: (ans) =>
        ans?.value === 1 ? "fatigue" : "somatic-fatigue-duration",
    }),
    new Item({
      id: "somatic-fatigue-duration",
      question:
        "In total, did the discomfort last for more than 3 hours on ANY day during the PAST SEVEN DAYS?",
      answer_options: [
        { value: 1, text: "No, less than 3 hours" },
        {
          value: 2,
          text: "Yes, it has lasted for more than 3 hours on at least one day",
        },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 2) state.counters.increment("somatic", 1);
      },
      next_item: "somatic-discomfort-valence",
    }),
    new Item({
      id: "somatic-discomfort-valence",
      question: "Has the discomfort been unpleasant in the PAST SEVEN DAYS?",
      answer_options: [
        { value: 1, text: "Not at all" },
        { value: 2, text: "A little unpleasant" },
        { value: 3, text: "Unpleasant" },
        { value: 4, text: "Very unpleasant" },
      ],
      process_answer_fun: (ans, state) => {
        if (typeof ans?.value === "number" && ans?.value >= 3)
          state.counters.increment("somatic", 1);
      },
      next_item: "somatic-discomfort-distress",
    }),
    new Item({
      id: "somatic-discomfort-distress",
      question:
        "Has the discomfort bothered you when you were doing something interesting in the PAST SEVEN DAYS?",
      answer_options: [
        { value: 1, text: "No, discomfort has not bothered me" },
        {
          value: 2,
          text: "Yes, discomfort bothered me while doing something interesting",
        },
        {
          value: 3,
          text: "I haven't done anything interesting in the past week",
        },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 2) state.counters.increment("somatic", 1);
      },
      next_item: "somatic-duration",
    }),
    new Item({
      id: "somatic-duration",
      question:
        "How long have you been feeling this ache, pain or discomfort as you have just described?",
      answer_options: [
        { value: 1, text: "Less than 2 weeks" },
        { value: 2, text: "Between 2 weeks and 6 months" },
        { value: 3, text: "Between 6 months and 1 year" },
        { value: 4, text: "Between 1 and 2 years" },
        { value: 5, text: "Between 2 and 5 years" },
        { value: 6, text: "More than 5 years" },
      ],
      next_item: "fatigue-tired",
    }),
    new Item({
      id: "fatigue-tired",
      question:
        "Have you noticed that you've been getting tired in the PAST MONTH?",
      answer_options: [
        { value: 1, text: "No" },
        { value: 2, text: "Yes" },
      ],
      process_answer_fun: (ans, state) => {
        state.counters.set("score", state.counters.get("somatic") || 0);
      },
      next_item_fun: (ans) =>
        ans?.value === 1 ? "fatigue-energy" : "fatigue-tired-cause",
    }),
    new Item({
      id: "fatigue-tired-cause",
      question: "What do you think is the main reason for feeling tired?",
      answer_options: [
        { value: 1, text: "Problems with sleep" },
        { value: 2, text: "Tablets or medication" },
        { value: 3, text: "Physical illness" },
        {
          value: 4,
          text: "Working too hard, including looking after children",
        },
        { value: 5, text: "Stress, worry or other psychological reason" },
        { value: 6, text: "Physical exercise" },
        { value: 7, text: "Other cause" },
        { value: 8, text: "Don't know" },
      ],
      next_item_fun: (ans) =>
        ans?.value === 6 ? "concentration" : "fatigue-tired-frequency",
    }),
    new Item({
      id: "fatigue-tired-frequency",
      question:
        "On how many days have you felt tired during the PAST SEVEN DAYS?",
      answer_options: [
        { value: 1, text: "None" },
        { value: 2, text: "Between one and three days" },
        { value: 3, text: "Four days or more" },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 3) state.counters.increment("fatigue", 1);
      },
      next_item_fun: (ans) =>
        ans?.value === 1 ? "fatigue-energy" : "fatigue-tired-duration",
    }),
    new Item({
      id: "fatigue-tired-duration",
      question:
        "Have you felt tired for more than 3 hours in total on ANY day in the PAST SEVEN DAYS?",
      answer_options: [
        { value: 1, text: "No, less than 3 hours" },
        {
          value: 2,
          text: "Yes, I felt tired for more than 3 hours on at least one day",
        },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 2) state.counters.increment("fatigue", 1);
      },
      next_item: "fatigue-tired-push",
    }),
    new Item({
      id: "fatigue-tired-push",
      question:
        "Have you felt so tired that you've had to push yourself to get things done during the PAST SEVEN DAYS?",
      answer_options: [
        { value: 1, text: "No" },
        { value: 2, text: "Yes, on one or more occasion" },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 2) state.counters.increment("fatigue", 1);
      },
      next_item: "fatigue-tired-enjoy",
    }),
    new Item({
      id: "fatigue-tired-enjoy",
      question:
        "Have you felt tired when doing things that you enjoy during the PAST SEVEN DAYS?",
      answer_options: [
        { value: 1, text: "No, not tired during enjoyable activities" },
        { value: 2, text: "Yes, tired during an enjoyable activity" },
        {
          value: 3,
          text: "I haven't done anything enjoyable in the past week",
        },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 2) state.counters.increment("fatigue", 1);
      },
      next_item: "fatigue-duration",
    }),
    new Item({
      id: "fatigue-energy",
      question:
        "During the PAST MONTH, have you felt you've been lacking in energy?",
      answer_options: [
        { value: 1, text: "No" },
        { value: 2, text: "Yes" },
      ],
      next_item_fun: (ans) =>
        ans?.value === 1 ? "concentration" : "fatigue-energy-cause",
    }),
    new Item({
      id: "fatigue-energy-cause",
      question: "What do you think is the main reason for lacking in energy?",
      answer_options: [
        { value: 1, text: "Problems with sleep" },
        { value: 2, text: "Tablets or medication" },
        { value: 3, text: "Physical illness" },
        {
          value: 4,
          text: "Working too hard, including looking after children",
        },
        { value: 5, text: "Stress, worry or other psychological reason" },
        { value: 6, text: "Physical exercise" },
        { value: 7, text: "Other cause" },
        { value: 8, text: "Don't know" },
      ],
      next_item_fun: (ans) =>
        ans?.value === 6 ? "concentration" : "fatigue-energy-frequency",
    }),
    new Item({
      id: "fatigue-energy-frequency",
      question:
        "On how many days have you felt lacking in energy during the PAST SEVEN DAYS?",
      answer_options: [
        { value: 1, text: "None" },
        { value: 2, text: "Between one and three days" },
        { value: 3, text: "Four days or more" },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 3) state.counters.increment("fatigue", 1);
      },
      next_item_fun: (ans) =>
        ans?.value === 1 ? "concentration" : "fatigue-energy-duration",
    }),
    new Item({
      id: "fatigue-energy-duration",
      question:
        "Have you felt lacking in energy for more than 3 hours in total on ANY day in the PAST SEVEN DAYS?",
      answer_options: [
        { value: 1, text: "No, less than 3 hours" },
        {
          value: 2,
          text: "Yes, I felt tired for more than 3 hours on at least one day",
        },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 2) state.counters.increment("fatigue", 1);
      },
      next_item: "fatigue-energy-push",
    }),
    new Item({
      id: "fatigue-energy-push",
      question:
        "Have you felt so lacking in energy that you've had to push yourself to get things done during the PAST SEVEN DAYS?",
      answer_options: [
        { value: 1, text: "No" },
        { value: 2, text: "Yes, on one or more occasion" },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 2) state.counters.increment("fatigue", 1);
      },
      next_item: "fatigue-energy-enjoy",
    }),
    new Item({
      id: "fatigue-energy-enjoy",
      question:
        "Have you felt lacking in energy when doing things that you enjoy during the PAST SEVEN DAYS?",
      answer_options: [
        { value: 1, text: "No, not tired during enjoyable activities" },
        { value: 2, text: "Yes, tired during an enjoyable activity" },
        {
          value: 3,
          text: "I haven't done anything enjoyable in the past week",
        },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 2) state.counters.increment("fatigue", 1);
      },
      next_item: "fatigue-duration",
    }),
    new Item({
      id: "fatigure-duration",
      question:
        "How long have you been feeling tired or lacking in energy in the way you have just described?",
      answer_options: [
        { value: 1, text: "Less than 2 weeks" },
        { value: 2, text: "Between 2 weeks and 6 months" },
        { value: 3, text: "Between 6 months and 1 year" },
        { value: 4, text: "Between 1 and 2 years" },
        { value: 5, text: "Between 2 and 5 years" },
        { value: 6, text: "More than 5 years" },
      ],
      process_answer_fun: (ans, state) => {
        if (
          state.counters.get("somatic") >= 2 &&
          state.counters.get("fatigue") >= 2
        )
          state.counters.increment("NEURAS", 1);
      },
      next_item: "concentration",
    }),

    new Item({
      id: "concentration",
      question:
        "In the PAST MONTH, have you had any problems in concentrating on what you are doing?",
      answer_options: [
        { value: 1, text: "No" },
        { value: 2, text: "Yes, problems concentrating on what I am doing" },
      ],
      process_answer_fun: (ans, state) => {
        const fatigue = state.counters.get("fatigue");
        if (!fatigue) return;
        state.counters.increment("score", fatigue);
        if (fatigue >= 2) state.counters.increment("depression-criterion-1", 1);
      },
      next_item: "concentration-forgetting",
    }),
    new Item({
      id: "concentration-forgetting",
      question:
        "Have you noticed any problems with forgetting things in the PAST MONTH?",
      answer_options: [
        { value: 1, text: "No" },
        { value: 2, text: "Yes" },
      ],
      next_item_fun: (ans, state) => {
        if (
          ans?.value === 1 &&
          state.getItemById("concentration").answer?.value === 1
        )
          return "sleep-loss";
        return "concentration-frequency";
      },
    }),
    new Item({
      id: "concentration-frequency",
      question:
        "On how many days have you noticed problems with your concentration OR your memory during the PAST SEVEN DAYS?",
      answer_options: [
        { value: 1, text: "None" },
        { value: 2, text: "Between one and three days" },
        { value: 3, text: "Four days or more" },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 3) state.counters.increment("concentration", 1);
      },
      next_item_fun: (ans, state) => {
        if (ans?.value === 1) return "sleep-loss";
        if (
          ans?.value === 1 &&
          state.getItemById("concentration-forgetting").answer?.value === 2
        )
          return "concentration-forgetting-important";
        return "concentration-tasks";
      },
    }),
    new Item({
      id: "concentration-tasks",
      question:
        "In the PAST SEVEN DAYS could you concentrate on all of the following without your mind wandering?:\n\na whole TV programme\n\na newspaper article\n\ntalking to someone?",
      answer_options: [
        { value: 1, text: "Yes, I could concentrate on all of them" },
        {
          value: 2,
          text: "No, I couldn't concentrate on at least one of these things",
        },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 2) state.counters.increment("concentration", 1);
      },
      next_item: "concentration-distress",
    }),
    new Item({
      id: "concentration-distress",
      question:
        "In the PAST SEVEN DAYS, have these problems with your concentration actually STOPPED you from getting on with things you used to do or would like to do?",
      answer_options: [
        { value: 1, text: "No" },
        { value: 2, text: "Yes" },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 2) state.counters.increment("concentration", 1);
      },
      next_item: "concentration-duration",
    }),
    new Item({
      id: "concentration-duration",
      question:
        "How long have you been having problems with your CONCENTRATION as you have described?",
      answer_options: [
        { value: 1, text: "Less than 2 weeks" },
        { value: 2, text: "Between 2 weeks and 6 months" },
        { value: 3, text: "Between 6 months and 1 year" },
        { value: 4, text: "Between 1 and 2 years" },
        { value: 5, text: "Between 2 and 5 years" },
        { value: 6, text: "More than 5 years" },
      ],
      process_answer_fun: (ans, state) => {
        if (
          state.counters.get("somatic") >= 2 &&
          state.counters.get("fatigue") >= 2
        )
          state.counters.increment("NEURAS", 1);
      },
      next_item_fun: (ans, state) => {
        if (state.getItemById("concentration-forgetting").answer?.value === 1)
          return "sleep-loss";
        return "concentration-forgetting-important";
      },
    }),
    new Item({
      id: "concentration-forgetting-important",
      question: "Have you forgotten anything important in the PAST SEVEN DAYS?",
      answer_options: [
        { value: 1, text: "No" },
        { value: 2, text: "Yes, I have forgotten something important" },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 2) state.counters.increment("concentration", 1);
      },
      next_item: "concentration-forgetting-duration",
    }),
    new Item({
      id: "concentration-forgetting-duration",
      question:
        "How long have you been having problems with your MEMORY as you have described?",
      answer_options: [
        { value: 1, text: "Less than 2 weeks" },
        { value: 2, text: "Between 2 weeks and 6 months" },
        { value: 3, text: "Between 6 months and 1 year" },
        { value: 4, text: "Between 1 and 2 years" },
        { value: 5, text: "Between 2 and 5 years" },
        { value: 6, text: "More than 5 years" },
      ],
      next_item: "sleep-loss",
    }),
    new Item({
      id: "sleep-loss",
      question:
        "In the PAST MONTH, have you been having problems with trying to get to sleep or with getting back to sleep if you woke up or were woken up?",
      answer_options: [
        { value: 1, text: "No" },
        { value: 2, text: "Yes" },
      ],
      process_answer_fun: (ans, state) => {
        const conc = state.counters.get("concentration");
        if (!conc) return;
        state.counters.increment("score", conc);
        if (conc >= 2) state.counters.increment("depression-criterion-2", 1);
      },
      next_item_fun: (ans) =>
        ans?.value === 1 ? "sleep-increase" : "sleep-loss-frequency",
    }),
    new Item({
      id: "sleep-loss-frequency",
      question:
        "On how many nights in the SEVEN NIGHTS did you have problems with your sleep?",
      answer_options: [
        { value: 1, text: "None" },
        { value: 2, text: "Between one and three nights" },
        { value: 3, text: "Four nights or more" },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 3) state.counters.increment("sleep", 1);
      },
      next_item_fun: (ans) =>
        ans?.value === 1 ? "irritability" : "sleep-loss-time",
    }),
    new Item({
      id: "sleep-loss-time",
      question:
        "Thinking about the night you had the LEAST sleep in the PAST WEEK, how long did you spend trying to get to sleep?\n\nOnly include time spent lying awake in bed TRYING to return to sleep.",
      answer_options: [
        { value: 1, text: "Less than 15 minutes" },
        { value: 2, text: "Between 15 minutes and 1 hour" },
        { value: 3, text: "Between 1 and 3 hours" },
        { value: 4, text: "Three hours or more" },
      ],
      process_answer_fun: (ans, state) => {
        const v = ans?.value;
        if (!v) return;
        if (v === 2) state.counters.increment("sleep", 1);
        if (v >= 3) state.counters.increment("sleep", 2);
      },
      next_item_fun: (ans) =>
        ans?.value === 1 ? "irritability" : "sleep-loss-long",
    }),
    new Item({
      id: "sleep-loss-long",
      question:
        "In the PAST SEVEN DAYS, how many nights did you spend 3 or more hours trying to get to sleep?",
      answer_options: [
        { value: 1, text: "None" },
        { value: 2, text: "Between one and three nights" },
        { value: 3, text: "Four nights or more" },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 3) state.counters.increment("sleep", 1);
      },
      next_item: "sleep-loss-morning",
    }),
    new Item({
      id: "sleep-loss-morning",
      question:
        "In the PAST SEVEN DAYS, have you woken more than two hours earlier than you needed to and found that you couldn't get back to sleep?",
      answer_options: [
        { value: 1, text: "No" },
        { value: 2, text: "Yes, and I couldn't get back to sleep" },
      ],
      process_answer_fun: (ans, state) => {
        const v = ans?.value;
        const sleep = state.counters.get("sleep");
        if (!v || !sleep) return;
        if (v >= 1 && sleep >= 1) state.counters.set("SLEEPCH", 2);
        if (v === 2) {
          if (sleep >= 1) state.counters.set("SLEEPCH", 1);
          state.counters.increment("depression-criterion-3", 1);
        }
      },
      next_item: "sleep-cause",
    }),
    new Item({
      id: "sleep-cause",
      question: "What are your sleep difficulties caused by?",
      answer_options: [
        { value: 1, text: "Noises (babies crying, busy roads etc.)" },
        { value: 2, text: "Shift work or late nights" },
        { value: 3, text: "Pain or illness" },
        { value: 4, text: "Worries" },
        { value: 5, text: "Reason not known" },
        { value: 6, text: "Other" },
      ],
      next_item: "sleep-duration",
    }),
    new Item({
      id: "sleep-gain",
      question:
        "Has sleeping more than usual been a problem for you in the PAST MONTH?",
      answer_options: [
        { value: 1, text: "No" },
        {
          value: 2,
          text: "I have slept more than usual but this is not a problem",
        },
        { value: 3, text: "Yes" },
      ],
      next_item_fun: (ans) =>
        ans?.value !== 3 ? "irritability" : "sleep-gain-frequency",
    }),
    new Item({
      id: "sleep-gain-frequency",
      question:
        "On how many nights in the SEVEN NIGHTS did you have problems with your sleep?",
      answer_options: [
        { value: 1, text: "None" },
        { value: 2, text: "Between one and three nights" },
        { value: 3, text: "Four nights or more" },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 3) state.counters.increment("sleep", 1);
      },
      next_item_fun: (ans) =>
        ans?.value === 1 ? "irritability" : "sleep-gain-time",
    }),
    new Item({
      id: "sleep-gain-time",
      question:
        "Thinking about the night you slept the longest in the PAST SEVEN DAYS, how much longer did you sleep compared with how long you normally sleep for?",
      answer_options: [
        { value: 1, text: "Less than 15 minutes" },
        { value: 2, text: "Between 15 minutes and 1 hour" },
        { value: 3, text: "Between 1 and 3 hours" },
        { value: 4, text: "Three hours or more" },
      ],
      process_answer_fun: (ans, state) => {
        const v = ans?.value;
        if (!v) return;
        if (v === 2) state.counters.increment("sleep", 1);
        if (v >= 3) state.counters.increment("sleep", 2);
        if (v >= 3 && state.counters.get("SLEEPCH") >= 1)
          state.counters.set("SLEEPCH", 3);
      },
      next_item_fun: (ans) =>
        ans?.value === 1 ? "irritability" : "sleep-gain-long",
    }),
    new Item({
      id: "sleep-gain-long",
      question:
        "In the PAST SEVEN DAYS, on how many nights did you sleep for more than 3 hours longer usual?",
      answer_options: [
        { value: 1, text: "None" },
        { value: 2, text: "Between one and three nights" },
        { value: 3, text: "Four nights or more" },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 3) state.counters.increment("sleep", 1);
      },
      next_item: "sleep-duration",
    }),
    new Item({
      id: "sleep-duration",
      question:
        "How long have you had these problems with your sleep as you have described?",
      answer_options: [
        { value: 1, text: "Less than 2 weeks" },
        { value: 2, text: "Between 2 weeks and 6 months" },
        { value: 3, text: "Between 6 months and 1 year" },
        { value: 4, text: "Between 1 and 2 years" },
        { value: 5, text: "Between 2 and 5 years" },
        { value: 6, text: "More than 5 years" },
      ],
      next_item: "irritability",
    }),
    new Item({
      id: "irritability",
      question:
        "Many people become irritable or short tempered at times, though they may not show it.\n\nHave you felt irritable or short tempered with those around you in the PAST MONTH?",
      answer_options: [
        { value: 1, text: "No" },
        {
          value: 2,
          text: "Yes, I have felt irritable or short tempered recently",
        },
      ],
      process_answer_fun: (ans, state) => {
        const sleep = state.counters.get("sleep");
        if (!sleep) return;
        state.counters.increment("score", sleep);
        if (sleep >= 2) state.counters.increment("depression-criterion-2", 1);
      },
      next_item_fun: (ans) =>
        ans?.value === 2 ? "irritability-frequency" : "irritability-trivial",
    }),
    new Item({
      id: "irritability-trivial",
      question:
        "During the PAST MONTH, did you get short tempered or angry over things which now seem trivial when you look back on them?",
      answer_options: [
        { value: 1, text: "No" },
        { value: 2, text: "Sometimes" },
        { value: 3, text: "Yes" },
      ],
      next_item_fun: (ans) =>
        ans?.value === 1 ? "hypochondria" : "irritability-frequency",
    }),
    new Item({
      id: "irritability-frequency",
      question:
        "On how many days have you felt irritable, short tempered or angry in the PAST SEVEN DAYS?",
      answer_options: [
        { value: 1, text: "None" },
        { value: 2, text: "Between one and three days" },
        { value: 3, text: "Four days or more" },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 3) state.counters.increment("irritability", 1);
      },
      next_item_fun: (ans) =>
        ans?.value === 1 ? "hypochondria" : "irritability-long",
    }),
    new Item({
      id: "irritability-long",
      question:
        "In total, have you felt irritable, short tempered or angry for more than one hour on any day in the PAST SEVEN DAYS?",
      answer_options: [
        { value: 1, text: "No" },
        {
          value: 2,
          text: "Yes, I felt this way for more than one hour on at least one day",
        },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 2) state.counters.increment("irritability", 1);
      },
      next_item: "irritability-shout",
    }),
    new Item({
      id: "irritability-shout",
      question:
        "During the PAST SEVEN DAYS, have you felt so irritable, short tempered or angry that you have wanted to shout at someone, even if you haven't actually shouted?",
      answer_options: [
        { value: 1, text: "No" },
        { value: 2, text: "Yes, but I didn't actually shout at someone" },
        { value: 3, text: "Yes, and I actually shouted" },
      ],
      process_answer_fun: (ans, state) => {
        const v = ans?.value;
        if (!v) return;
        if (v >= 2) state.counters.increment("irritability", 1);
      },
      next_item: "irritability-rows",
    }),
    new Item({
      id: "irritability-rows",
      question:
        "In the past SEVEN DAYS, have you had arguments, rows or quarrels or lost your temper with anyone?",
      answer_options: [
        { value: 1, text: "No" },
        { value: 2, text: "Yes, but this was justified" },
        { value: 3, text: "Yes" },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 3) state.counters.increment("irritability", 1);
      },
      next_item: "irritability-duration",
    }),
    new Item({
      id: "irritability-duration",
      question:
        "How long have you been feeling irritable, short-tempered or angry as you have described?",
      answer_options: [
        { value: 1, text: "Less than 2 weeks" },
        { value: 2, text: "Between 2 weeks and 6 months" },
        { value: 3, text: "Between 6 months and 1 year" },
        { value: 4, text: "Between 1 and 2 years" },
        { value: 5, text: "Between 2 and 5 years" },
        { value: 6, text: "More than 5 years" },
      ],
      process_answer_fun: (ans, state) => {
        const irritation = state.counters.get("irritability") || 0;
        const fatigue = state.counters.get("fatigue") || 0;
        const sleep = state.counters.get("sleep") || 0;
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
      answer_options: [
        { value: 1, text: "No" },
        {
          value: 2,
          text: "Yes",
        },
      ],
      process_answer_fun: (ans, state) => {
        const irritability = state.counters.get("irritability");
        if (!irritability) return;
        state.counters.increment("score", irritability);
      },
      next_item_fun: (ans) =>
        ans?.value === 2 ? "hypochondria-frequency" : "hypochondria-serious",
    }),
    new Item({
      id: "hypochondria-serious",
      question:
        "Do you find yourself worrying that you might have a serious illness like cancer, heart disease or AIDS?",
      answer_options: [
        { value: 1, text: "No" },
        { value: 2, text: "Yes" },
      ],
      next_item_fun: (ans) =>
        ans?.value === 1 ? "depression" : "hypochondria-frequency",
    }),
    new Item({
      id: "hypochondria-frequency",
      question:
        "Thinking about the PAST SEVEN DAYS, on how many days have you found yourself worrying about your physical health, or worrying that you might have a serious physical illness?",
      answer_options: [
        { value: 1, text: "None" },
        { value: 2, text: "Between one and three days" },
        { value: 3, text: "Four days or more" },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 3) state.counters.increment("hypochondria", 1);
      },
      next_item_fun: (ans) =>
        ans?.value === 1 ? "depression" : "hypochondria-excessive",
    }),
    new Item({
      id: "hypochondria-excessive",
      question:
        "In your opinion, have you been worrying too much in view of your actual physical health?",
      answer_options: [
        { value: 1, text: "No" },
        {
          value: 2,
          text: "Yes, I worry too much",
        },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 2) state.counters.increment("hypochondria", 1);
      },
      next_item: "hypochondria-valence",
    }),
    new Item({
      id: "hypochondria-valence",
      question:
        "How unpleasant has this worrying been in the PAST SEVEN DAYS?",
      answer_options: [
        { value: 1, text: "Not at all" },
        { value: 2, text: "A little unpleasant" },
        { value: 3, text: "Unpleasant" },
        { value: 4, text: "Very unpleasant" },
      ],
      process_answer_fun: (ans, state) => {
        const v = ans?.value;
        if (!v) return;
        if (ans?.value >= 3) state.counters.increment("hypochondria", 1);
      },
      next_item: "hypochondria-distration",
    }),
    new Item({
      id: "hypochondria-distraction",
      question:
        "In the PAST SEVEN DAYS, have you been able to take your mind off your health worries at least once, by doing something else?",
      answer_options: [
        { value: 1, text: "Yes" },
        { value: 2, text: "No, I could not take my mind off these worries even once" },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 2) state.counters.increment("hypochondria", 1);
      },
      next_item: "hypochondria-duration",
    }),
    new Item({
      id: "hypochondria-duration",
      question:
        "How long have you been worrying about your physical health in the way you have described?",
      answer_options: [
        { value: 1, text: "Less than 2 weeks" },
        { value: 2, text: "Between 2 weeks and 6 months" },
        { value: 3, text: "Between 6 months and 1 year" },
        { value: 4, text: "Between 1 and 2 years" },
        { value: 5, text: "Between 2 and 5 years" },
        { value: 6, text: "More than 5 years" },
      ],
      next_item: "depression",
    }),
    new Item({
      id: "depression",
      question:
        "Almost everyone becomes low in mood or depressed at times.\n\nHave you had a spell of feeling sad, miserable or depressed in the PAST MONTH?",
      answer_options: [
        { value: 1, text: "No" },
        {
          value: 2,
          text: "Yes",
        },
      ],
      process_answer_fun: (ans, state) => {
        const hypochondria = state.counters.get("hypochondria");
        if (!hypochondria) return;
        state.counters.increment("score", hypochondria);
      },
      next_item_fun: (ans) =>
        ans?.value === 1 ? "depression-enjoy" : "depression-recent",
    }),
    new Item({
      id: "depression-recent",
      question:
        "In the PAST SEVEN DAYS, have you had a spell of feeling sad, miserable or depressed?",
      answer_options: [
        { value: 1, text: "No, not in the past week" },
        { value: 2, text: "Yes" },
      ],
      next_item: "depression-enjoy",
    }),
    new Item({
      id: "depression-enjoy",
      question:
        "During the PAST MONTH, have you been able to enjoy or take an interest in things as much as you usually do?",
      answer_options: [
        { value: 1, text: "Yes" },
        { value: 2, text: "No, less enjoyment than usual" },
        { value: 3, text: "No, I don't enjoy anything" },
      ],
      next_item_fun: (ans, state) => {
        if (ans?.value === 1 && state.getItemById("depression-recent").answer?.value === 1)
          return "worry";
        return "depression-enjoy-recent";
      },
    }),
    new Item({
      id: "depression-enjoy-recent",
      question:
        "In the PAST SEVEN DAYS, have you been able to enjoy or take an interest in things as much as usual?",
      answer_options: [
        { value: 1, text: "Yes" },
        { value: 2, text: "No, less enjoyment than usual" },
        { value: 3, text: "No, I don't enjoy anything" },
      ],
      process_answer_fun: (ans, state) => {
        const v = ans?.value;
        if (!v) return;
        if (ans?.value >= 2) {
          state.counters.increment("depression", 1);
          state.counters.increment("depression-criterion-1", 1);
          state.counters.increment("depression-criterion-3", 1);
        }
      },
      next_item_fun: (ans, state) => {
        if (ans?.value === 1 && state.getItemById("depression-recent").answer?.value === 1)
          return "worry";
        return "depression-sad";
      },
    }),
    new Item({
      id: "depression-sad",
      question:
        "In the PAST SEVEN DAYS, on how many days have you felt sad, miserable or depressed OR unable to enjoy or take an interest in things?",
      answer_options: [
        { value: 1, text: "None" },
        { value: 2, text: "Between one and three days" },
        { value: 3, text: "Four days or more" },
      ],
      process_answer_fun: (ans, state) => {
        if (ans?.value === 3) state.counters.increment("depression", 1);
      },
      next_item: "depression-sad-long",
    }),
    new Item({
      id: "depression-sad-long",
      question:
        "Have you felt sad, miserable or depressed OR unable to enjoy or take an interest in things for more than 3 hours in total on any day in the PAST SEVEN DAYS?",
      answer_options: [
        { value: 1, text: "No, less than 3 hours" },
        { value: 2, text: "Yes, for 3 hours or more on at least one day" },
      ],
      process_answer_fun: (ans, state) => {
        const v = ans?.value;
        if (!v) return;
        if (v === 2) state.counters.increment("depression", 1);
        if (v === 2 && state.getItemById("depression-sad").answer?.value === 3 && state.getItemById("depression-sad-long").answer?.value === 2)
          state.counters.increment("depression-criterion-1", 1);
      },
      next_item: "depression-content",
    }),
    new Item({
      id: "depression-content",
      question:
        "What is the MAIN thing that made you feel sad, miserable or depressed OR unable to enjoy or take an interest in things in the PAST WEEK?",
      answer_options: [
        { value: 1, text: "Family members, including spouse or partner" },
        { value: 2, text: "Relationships with friends or people at work" },
        { value: 3, text: "Housing" },
        { value: 4, text: "Money or bills" },
        { value: 5, text: "Your own physical health, including pregnancy" },
        { value: 6, text: "Your own mental health" },
        { value: 7, text: "Work or lack of work (including studying)" },
        { value: 8, text: "Legal difficulties" },
        { value: 9, text: "Political issues or the news" },
      ],
      next_item: "DEPR5",
    }),
  ],
  onComplete: console.log,
});
