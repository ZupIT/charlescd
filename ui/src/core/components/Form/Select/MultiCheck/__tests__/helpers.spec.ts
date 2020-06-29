import { handleChange } from "../helpers";
import { Option } from "../../interfaces";
import { allOption } from "../constants";
import { ActionMeta, OptionTypeBase } from "react-select";

describe("handleChange tests", () => {
  const option1 = { label: "foo1", value: "bar1" };
  const option2 = { label: "foo2", value: "bar2" };

  test("should validate onChange without selected options", () => {
    const selected = [] as Option[];
    const onChange = jest.fn();

    handleChange(selected, null, onChange, []);
    expect(onChange).toHaveBeenCalledWith(selected);
  });

  test('should validate onChange when "select all" is selected', () => {
    const selected = [option1, allOption];
    const options = [option1, option2];
    const onChange = jest.fn();

    handleChange(selected, null, onChange, options);
    expect(onChange).toHaveBeenCalledWith([allOption, ...options]);
  });

  test('should validate onChange when "select all" is already selected', () => {
    const selected = [allOption, option1];
    const options = [option1, option2];
    const onChange = jest.fn();

    handleChange(selected, null, onChange, options);
    expect(onChange).toHaveBeenCalledWith([option1]);
  });

  test("should validate onChange and select all options", () => {
    const selected = [option1, option2];
    const options = [option1, option2];
    const onChange = jest.fn();
    const event = { action: "select-option" } as ActionMeta<OptionTypeBase>;

    handleChange(selected, event, onChange, options);
    expect(onChange).toHaveBeenCalledWith([allOption, ...options]);
  });
});
