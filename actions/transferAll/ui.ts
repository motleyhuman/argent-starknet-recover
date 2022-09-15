import ora from "ora";
import prompts from "prompts";
import { ValidationError } from "yup";
import { addressSchema } from "../../schema";
import { Account } from "../../ui/pickAccounts";
import { transferAll } from "./core";

export async function showTransferAll(accounts: Account[]) {
  const { toAddress } = await prompts(
    {
      type: "text",
      name: "toAddress",
      message: "Enter the address to transfer to",
      validate: async (value: string) => {
        try {
          await addressSchema.validate(value);
        } catch (e) {
          return `Invalid address '${value}'.${
            e instanceof ValidationError ? ` Reason: ${e.message}` : ""
          }`;
        }

        return true;
      },
    },
    {
      onCancel: () => process.exit(0),
    }
  );

  const spinner = ora("Transferring all tokens").start();

  await Promise.all(
    accounts.map(async (acc) => transferAll(acc, toAddress, spinner))
  );

  spinner.succeed("All tokens transferred");
}