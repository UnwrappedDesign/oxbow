import { Page } from "./page";

export class TestComponentIframePage extends Page {
  constructor() {
    super('/iframe/src/components/oxbow/__test__/test.astro');
  }
}