// Load playwright module
// Write a test
// Create POST api request
// Validate status code
// Validate JSON api response
// Validate nested JSON object
import { test, expect, APIResponse } from "@playwright/test";
import { stringFormat } from "../utils/common";
import * as postDynamicData from "../test-data/post_dynamic_request_body.json";

interface BookingDates {
  checkin: string;
  checkout: string;
}

interface BookingInformation {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds: string;
}

interface PostApiResponse {
  bookingid: number;
  booking: BookingInformation;
}

test("Create POST api request using dynamic JSON file", async ({ request }) => {
  const dynamicRequestBody = stringFormat(
    JSON.stringify(postDynamicData),
    "Dynamic data",
    "New Last Name",
    "Pen pineapple apple pen"
  );

  const postApiResponse: APIResponse = await request.post("booking", {
    data: JSON.parse(dynamicRequestBody),
  });
  expect(postApiResponse.ok()).toBeTruthy();
  expect(postApiResponse.status()).toBe(200);

  const postApiResponseBody: PostApiResponse = await postApiResponse.json();
  console.log(postApiResponseBody);

  expect(postApiResponseBody.booking).toHaveProperty(
    "firstname",
    "Dynamic data"
  );
  expect(postApiResponseBody.booking.lastname).toEqual("New Last Name");
  expect(postApiResponseBody.booking.bookingdates.checkin).toBe("2023-01-01");
  expect(postApiResponseBody.booking.bookingdates).toHaveProperty(
    "checkout",
    "2024-01-01"
  );
});
