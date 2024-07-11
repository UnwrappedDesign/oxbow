import { Page } from "./page";

export class TestComponentIframePage extends Page {
  constructor() {
    super('/iframe/src/components/windstatic/__test__/test.astro');
  }
}