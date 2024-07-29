// Load playwright module
// Write a test
// Create POST api request
// Validate status code
// Validate JSON api response
// Validate nested JSON object
import { test, expect, APIResponse } from "@playwright/test";
import { faker } from "@faker-js/faker";


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

test("Create POST api request using dynamic request body", async ({
  request,
}) => {
  const firstName: string = faker.person.firstName();
  const lastName: string = faker.person.lastName();
  const price: number = faker.number.int(1000);
  const additional: string = faker.word.words(7);
  const checkIn: string = faker.date.recent().toLocaleDateString("lt-LT");
  const checkOut: string = faker.date.future().toLocaleDateString("lt-LT");

  const postApiResponse: APIResponse = await request.post("booking", {
    data: {
      firstname: firstName,
      lastname: lastName,
      totalprice: price,
      depositpaid: true,
      bookingdates: {
        checkin: checkIn,
        checkout: checkOut,
      },
      additionalneeds: additional,
    },
  });
  expect(postApiResponse.ok()).toBeTruthy();
  expect(postApiResponse.status()).toBe(200);

  const postApiResponseBody: PostApiResponse = await postApiResponse.json();
  console.log(postApiResponseBody);

  expect(postApiResponseBody.booking).toHaveProperty("firstname", firstName);
  expect(postApiResponseBody.booking.lastname).toEqual(lastName);
  expect(postApiResponseBody.booking.bookingdates.checkin).toBe(checkIn);
  expect(postApiResponseBody.booking.bookingdates).toHaveProperty(
    "checkout",
    checkOut
  );
});
