// Load playwright module
// Write a test
// Create POST api request
// Validate status code
// Validate JSON api response
// Validate nested JSON object
import { test, expect, APIResponse } from "@playwright/test";

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

test("Create POST api request using static request body", async ({
  request,
}) => {
  const postApiResponse: APIResponse = await request.post("booking", {
    data: {
      firstname: "Api test",
      lastname: "Create post",
      totalprice: 1111,
      depositpaid: true,
      bookingdates: {
        checkin: "2023-01-01",
        checkout: "2024-01-01",
      },
      additionalneeds: "super run",
    },
  });

  expect(postApiResponse.ok()).toBeTruthy();
  expect(postApiResponse.status()).toBe(200);

  const postApiResponseBody: PostApiResponse = await postApiResponse.json();

  expect(postApiResponseBody.booking).toHaveProperty("firstname", "Api test");
  expect(postApiResponseBody.booking.lastname).toEqual("Create post");
  expect(postApiResponseBody.booking.bookingdates.checkin).toBe("2023-01-01");
  expect(postApiResponseBody.booking.bookingdates).toHaveProperty(
    "checkout",
    "2024-01-01"
  );
});
