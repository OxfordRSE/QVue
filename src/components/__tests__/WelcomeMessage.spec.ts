import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
// import any store you want to interact with in tests
// import { useSomeStore } from '@/stores/myStore'

import WelcomeMessage from "@/components/WelcomeMessage.vue";

describe("WelcomeMessage", () => {
  it("renders properly", () => {
    const wrapper = mount(WelcomeMessage, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
      props: { show_continue: false },
    });
    expect(wrapper.text()).toContain("Welcome to the CIS-R");
  });
});
