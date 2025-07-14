// @vitest-environment happy-dom

import {
  processConfig,
  processListData,
  processAllData,
} from "../src/js/dataTable";
import { describe, expect, test } from "vitest";

describe("processConfig", () => {
  test("processes config with sheetId", () => {
    let config = [["sheetId", "abc"]];
    let expected = {
      sheetId: "abc",
      displayFields: [],
      title: "",
      summary: "",
    };

    expect(processConfig(config)).toEqual(expected);
  });

  test("processes config with displayFields", () => {
    let config = [
      ["sheetId", "abc"],
      ["displayFields", "Aa,Bb,Cc"],
    ];
    let expected = {
      sheetId: "abc",
      displayFields: ["Aa", "Bb", "Cc"],
      title: "",
      summary: "",
    };

    expect(processConfig(config)).toEqual(expected);
  });

  test("processes config with title", () => {
    let config = [
      ["sheetId", "abc"],
      ["title", "my title"],
    ];
    let expected = {
      sheetId: "abc",
      displayFields: [],
      title: "my title",
      summary: "",
    };

    expect(processConfig(config)).toEqual(expected);
  });

  test("processes config with summary", () => {
    let config = [
      ["sheetId", "abc"],
      ["summary", "my summary"],
    ];
    let expected = {
      sheetId: "abc",
      displayFields: [],
      title: "",
      summary: "my summary",
    };

    expect(processConfig(config)).toEqual(expected);
  });

  test("processes config with sheetId", () => {
    let config = [["sheetId", "abc"]];
    let expected = {
      sheetId: "abc",
      displayFields: [],
      title: "",
      summary: "",
    };

    expect(processConfig(config)).toEqual(expected);
  });

  test("processes config with displayFields", () => {
    let config = [
      ["sheetId", "abc"],
      ["displayFields", "Aa,Bb,Cc"],
    ];
    let expected = {
      sheetId: "abc",
      displayFields: ["Aa", "Bb", "Cc"],
      title: "",
      summary: "",
    };

    expect(processConfig(config)).toEqual(expected);
  });

  test("processes config with title", () => {
    let config = [
      ["sheetId", "abc"],
      ["title", "my title"],
    ];
    let expected = {
      sheetId: "abc",
      displayFields: [],
      title: "my title",
      summary: "",
    };

    expect(processConfig(config)).toEqual(expected);
  });

  test("processes config with all fields", () => {
    let config = [
      ["sheetId", "abc"],
      ["title", "my title"],
      ["displayFields", "Aa,Bb,Cc"],
      ["summary", "my summary"],
    ];
    let expected = {
      sheetId: "abc",
      displayFields: ["Aa", "Bb", "Cc"],
      title: "my title",
      summary: "my summary",
    };

    expect(processConfig(config)).toEqual(expected);
  });

  test("returns undefined if sheetId is missing", () => {
    let config = [["displayFields", "Aa,Bb,Cc"]];
    let expected = undefined;

    expect(processConfig(config)).toEqual(expected);
  });
});

function createRecords() {
  let record1 = new Map();
  record1.set("id", 1);
  record1.set("first", "Jane");
  record1.set("last", "Bennet");

  let record2 = new Map();
  record2.set("id", 2);
  record2.set("first", "Emma");
  record2.set("last", "Woodhouse");

  return [record1, record2];
}

describe("processAllData", () => {
  test("it converts array of objects to array of Maps", () => {
    let data = [
      { id: 1, first: "Jane", last: "Bennet" },
      { id: 2, first: "Emma", last: "Woodhouse" },
    ];

    let expected = createRecords();

    expect(processAllData(data)).toEqual(expected);
  });
});

describe("processListData", () => {
  test("it returns all the all keys if displayFields is empty", () => {
    let data = createRecords();
    let config = {
      displayFields: [],
    };
    let expected = data;

    expect(processListData(data, config)).toEqual(expected);
  });

  test("it returns keys listed in displayFields if displayFields is set", () => {
    let data = createRecords();
    let config = {
      displayFields: ["last", "first"],
    };
    let record1 = new Map();
    record1.set("last", "Bennet");
    record1.set("first", "Jane");
    let record2 = new Map();
    record2.set("last", "Woodhouse");
    record2.set("first", "Emma");
    let expected = [record1, record2];

    expect(processListData(data, config)).toEqual(expected);
  });
});
