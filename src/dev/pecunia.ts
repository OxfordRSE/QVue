import {
  type AnswerRow,
  AnswerType,
  Item,
  Questionnaire,
  type QuestionnaireProperties,
} from "questionnaire-core";

export * from "questionnaire-core";

const new_medication_item: (id: string) => Item = (id) => {
  return new Item({
    id: id,
    question:
      "Please list below any prescribed medications you have taken in the past 3 months.\n" +
      "If you have taken the same medication at different doses, please list each dose in a separate row and indicate the duration for each dose if known.\n",
    answers: [
      {
        type: AnswerType.TEXT,
        label: "Medication name",
      },
      {
        type: AnswerType.SELECT,
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
        type: AnswerType.NONE,
        label: "Dose",
        extra_answers: [
          { id: `${id}_dose`, type: AnswerType.NUMBER },
          {
            type: AnswerType.SELECT,
            options: [
              { label: "mg" },
              { label: "g" },
              { label: "ml" },
              { label: "other", extra_answers: [{ type: AnswerType.TEXT }] },
            ],
          },
        ],
      },
      {
        type: AnswerType.NONE,
        label: "How often have you taken the given medication?",
        extra_answers: [
          { id: `${id}_frequency`, type: AnswerType.NUMBER },
          {
            type: AnswerType.SELECT,
            label: "",
            options: [
              { label: "per day" },
              { label: "per week" },
              { label: "per month" },
              { label: "as needed" },
              {
                label: "other",
                extra_answers: [
                  { id: `${id}_frequency_other`, type: AnswerType.TEXT },
                ],
              },
            ],
          },
        ],
      },
      {
        type: AnswerType.NONE,
        label:
          "For how long have you taken the given medication in the past 3 months?",
        extra_answers: [
          { id: `${id}_duration`, type: AnswerType.NUMBER },
          {
            type: AnswerType.SELECT,
            label: "",
            options: [
              { label: "day(s)" },
              { label: "week(s)" },
              { label: "month(s)" },
            ],
          },
        ],
      },
    ],
    next_item_fun: (last_changed_answer, current_item, state) => {
      if (typeof current_item.answers[0].content === "undefined") return "D1";
      return state.next_item_in_sequence_id;
    },
  });
};

const medication_items: Item[] = [];
for (let i = 0; i < 8; i++)
  medication_items.push(new_medication_item(`C1.2.${i + 1}`));

export const _state_properties: QuestionnaireProperties = {
  items: [
    new Item({
      id: "welcome",
      question:
        "In this questionnaire we are trying to find out about the various impacts of your health. Please read the instructions provided for each question carefully. Questions that can be skipped are clearly indicated. If you have difficulty answering any of the questions or knowing details, please provide the best answer you can.\n" +
        "Your responses will be treated as confidential.\n" +
        "Thank you very much in advance for helping us by completing this questionnaire.\n" +
        "This questionnaire consists of the following sections.\n" +
        "Section A. Place of living and overnight stays\n" +
        "Section B. Non-residential health and social care\n" +
        "Section C. Medication\n" +
        "Section D. Unpaid help (informal care)\n" +
        "Section E. Education\n" +
        "Section F. Employment and productivity\n" +
        "Section G. Safety and justice system \n" +
        "Section H. Out-of-pocket and other expenses\n" +
        "Section I. Final remarks\n",
    }),
    new Item({
      id: "A1",
      question:
        "A1\tWhere have you lived or stayed overnight (e.g. in hospital) in the past 3 months?\n" +
        "\n" +
        "Please tick all answers that apply and indicate the number of nights that you spent in each place. If you are unsure, please tick ‘Other’ and provide details.\n" +
        "\n",
      answers: [
        {
          type: AnswerType.NUMBER,
          label: "Individual or shared flat or house",
        },
        {
          type: AnswerType.NUMBER,
          label: "Family or friend’s flat or house ",
        },
        {
          type: AnswerType.NUMBER,
          label: "Dormitory (e.g. boarding school, university residence)",
        },
        {
          type: AnswerType.NUMBER,
          label: "Paid temporary accommodation (e.g. hotel)",
        },
        {
          type: AnswerType.NUMBER,
          label: "Emergency shelter (e.g. temporary shelter for homeless)",
        },
        {
          type: AnswerType.NUMBER,
          label: "Sheltered housing (e.g. housing with assistance)",
        },
        {
          type: AnswerType.NUMBER,
          label: "Nursing home (e.g. residential care home with nursing)",
        },
        {
          type: AnswerType.NUMBER,
          label: "Other long-term residential care home",
        },
        {
          type: AnswerType.NUMBER,
          label:
            "Therapeutic community home (e.g. temporary group residence for therapeutic purposes)",
        },
        {
          type: AnswerType.NONE,
          label: "Hospital",
          extra_answers: [
            {
              id: "A1_hospital_0",
              type: AnswerType.NUMBER,
              label:
                "Type of hospital department/service (e.g. oncology, surgery, psychiatry):",
              extra_answers: [
                { id: "A1_hospital_0_detail", type: AnswerType.TEXT },
              ],
            },
            {
              id: "A1_hospital_1",
              type: AnswerType.NUMBER,
              label:
                "Type of hospital department/service (e.g. oncology, surgery, psychiatry):",
              extra_answers: [
                { id: "A1_hospital_1_detail", type: AnswerType.TEXT },
              ],
            },
            {
              id: "A1_hospital_2",
              type: AnswerType.NUMBER,
              label:
                "Type of hospital department/service (e.g. oncology, surgery, psychiatry):",
              extra_answers: [
                { id: "A1_hospital_2_detail", type: AnswerType.TEXT },
              ],
            },
          ],
        },
        {
          type: AnswerType.NUMBER,
          label: "Palliative care (e.g. hospice)",
        },
        {
          type: AnswerType.NUMBER,
          label: "Place of detention (e.g. prison)",
        },
        {
          type: AnswerType.NUMBER,
          label: "On the street",
        },
        {
          type: AnswerType.NUMBER,
          label: "Other, please specify",
          extra_answers: [{ id: "A1_other_detail", type: AnswerType.TEXT }],
        },
      ],
    }),
    {
      id: "B1",
      question:
        "Have you used any non-emergency outpatient/social care services in the past 3 months?\n" +
        "Non-emergency outpatient/social care services could include routine check-up appointments, scheduled appointments to discuss any physical or mental health issues, and telephone or online contacts (e.g. phone consultation, online prescription ordering). Please only consider the services you used for yourself and not those you may have used on behalf of someone else.\n",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { label: "Yes" },
            { label: "No" },
            { label: "I don’t know/I would rather not say" },
          ],
        },
      ],
      next_item_fun: (last_changed_answer) => {
        if (last_changed_answer?.content === 0) return "B1.2";
        return "B2.1";
      },
    },
    {
      id: "B1.2",
      question:
        "How many times have you used any of the following non-emergency outpatient/social care services in the past 3 months?\n" +
        "\n" +
        "Please tick all answers that apply and indicate the number of times you have used a given service. If you are unsure, please tick ‘Other’ and provide details.\n",
      answers: [
        {
          type: AnswerType.NUMBER,
          label: "General practitioner (GP)/family doctor",
        },
        {
          type: AnswerType.NUMBER,
          label: "Dental care",
        },
        {
          type: AnswerType.NUMBER,
          label:
            "Specialist medical care (e.g. orthopaedist, psychiatrist, gynaecologist)",
          extra_answers: [
            {
              id: "B1.2_specialist",
              type: AnswerType.TEXT,
              label: "Please specify:",
            },
          ],
        },
        {
          type: AnswerType.NUMBER,
          label: "Diagnostic imaging services (e.g. MRI, CT scan)",
          extra_answers: [
            {
              id: "B1.2_imaging",
              type: AnswerType.TEXT,
              label: "Please specify:",
            },
          ],
        },
        {
          type: AnswerType.NUMBER,
          label:
            "Diagnostic laboratory services (e.g. genetic testing, blood tests)",
          extra_answers: [
            { id: "B1.2_lab", type: AnswerType.TEXT, label: "Please specify:" },
          ],
        },
        {
          type: AnswerType.NUMBER,
          label:
            "Other health care (e.g. psychologist, physiotherapist, dietician)",
          extra_answers: [
            {
              id: "B1.2_other_healthcare",
              type: AnswerType.TEXT,
              label: "Please specify:",
            },
          ],
        },
        {
          type: AnswerType.NUMBER,
          label: "Social care (e.g. social worker)",
          extra_answers: [
            {
              id: "B1.2_social",
              type: AnswerType.TEXT,
              label: "Please specify:",
            },
          ],
        },
        {
          type: AnswerType.NUMBER,
          label:
            "Holistic health care (e.g. acupuncturist, homeopathist, Traditional Chinese Medicine (TCM), osteopath)",
          extra_answers: [
            {
              id: "B1.2_alternative",
              type: AnswerType.TEXT,
              label: "Please specify:",
            },
          ],
        },
        {
          type: AnswerType.NUMBER,
          label: "Other, please specify",
          extra_answers: [{ id: "B1.2_other", type: AnswerType.TEXT }],
        },
      ],
    },
    {
      id: "B2.1",
      question:
        "B2.1\tHave you used any day care services in the past 3 months?\n" +
        "Day care services are usually used only for part of the day and do not involve an overnight stay.\n",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { label: "Yes" },
            { label: "No" },
            { label: "I don’t know/I would rather not say" },
          ],
        },
      ],
      next_item_fun: (last_changed_answer) => {
        if (last_changed_answer?.content === 0) return "B2.2";
        return "B3.1";
      },
    },
    {
      id: "B2.2",
      question:
        "B2.2\tHow many times did you use any of the following day care services in the past 3 months?\n" +
        "Please tick all answers that apply and indicate the number of days you used a given service for. If you are unsure, please tick ‘Other’ and provide details.\n" +
        "\n",
      answers: [
        {
          type: AnswerType.NUMBER,
          label: "Medical day care (e.g. day patient in hospital)",
        },
        {
          type: AnswerType.NUMBER,
          label: "Non-medical day care (e.g. day care centre)",
        },
        {
          type: AnswerType.NUMBER,
          label: "Other, please specify:",
          extra_answers: [{ id: "B2.2_other", type: AnswerType.TEXT }],
        },
      ],
    },
    {
      id: "B3.1",
      question:
        "Have you participated in any support/self-help groups in the past 3 months?" +
        "A support/self-help group is a group of people that meet to discuss their condition and provide each other with emotional support or advice.",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            {
              label: "Yes, I participated in a support/self-help group",
              extra_answers: [
                { id: "B3.1_number", type: AnswerType.NUMBER }
              ]
            },
            { label: "No" },
            { label: "I don’t know/I would rather not say" },
          ],
        },
      ]
    },
    {
      id: "B4.1",
      question:
        "Have you used any emergency care services for yourself in the past 3 months?\n" +
        "Emergency care services include: a ride in an emergency ambulance, a visit to an Accident and Emergency (A&E) department, a visit from paramedics, or contact with an emergency doctor on call. \n",
      answers: [
        {
          type: AnswerType.RADIO,
          options: [
            { label: "Yes" },
            { label: "No" },
            { label: "I don’t know/I would rather not say" },
          ],
        },
      ],
      next_item_fun: (last_changed_answer) => {
        if (last_changed_answer?.content === 0) return "B4.2";
        return "B5.1";
      },
    },
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
          extra_answers: {
            id: "other-expenses-description",
            type: AnswerType.TEXT,
          },
        },
      ],
      next_item: null,
    }),
    ...medication_items,
    new Item({
      id: "D1",
      question:
        "How many hours of unpaid help (informal care) have you received because of your health in the past 3 months?",
      answers: [{ type: AnswerType.NUMBER }],
      next_item: null,
    }),
  ],
  onComplete: (state) => {
    const now = new Date();
    const items: AnswerRow[] = [];
    state.items
      .filter((i) => i.answers.length)
      .filter((i) => i.answers.filter((a) => a.content_changed).length)
      .forEach((i) => items.push(...i.as_rows));
    state.data = {
      summary: `
      <h1>PECUNIA summary</h1>
      ${items
        .map(
          (i) =>
            `<ul><li>${i.data_id} [${i.id}]</li><li>${i.content}</li><li>${i.label}</li><li>${i.answer_utc_time}</li></ul>`
        )
        .join("\n")}
      `,
      key_data: {
        time: now.toUTCString(),
      },
      items,
      datetime: now.toUTCString(),
    };
  },
};

export const questionnaire: () => Questionnaire = () =>
  new Questionnaire(_state_properties);
