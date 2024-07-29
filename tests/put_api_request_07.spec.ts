import { test, expect, APIResponse } from "@playwright/test";
import { faker } from "@faker-js/faker";
import * as tokenRequestBody from "../test-data/token_request_body.json";
import * as putBody from "../test-data/put_request_body.json";

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

interface TokenRes {
  token: string;
}

test("Create PUT api request", async ({ request }) => {
  const firstName: string = faker.person.firstName();
  const lastName: string = faker.person.lastName();
  const price: number = faker.number.int(1000);
  const additional: string = faker.word.words(7);
  const checkIn: string = faker.date.recent().toLocaleDateString("lt-LT");
  const checkOut: string = faker.date.soon().toLocaleDateString("lt-LT");

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
  console.log("Created API BODY");
  console.log(postApiResponseBody);

  const booking_id: number = postApiResponseBody.bookingid;

  expect(postApiResponseBody.booking).toHaveProperty("firstname", firstName);
  expect(postApiResponseBody.booking.lastname).toEqual(lastName);
  expect(postApiResponseBody.booking.bookingdates.checkin).toBe(checkIn);
  expect(postApiResponseBody.booking.bookingdates).toHaveProperty(
    "checkout",
    checkOut
  );

  console.log("=======================================");
  // GET api response
  const getApiResponse: APIResponse = await request.get(
    `booking/${booking_id}`
  );

  console.log(await getApiResponse.json());

  //validate status
  expect(getApiResponse.ok()).toBeTruthy();
  expect(getApiResponse.status()).toBe(200);

  console.log("=========================================");
  // Generate token
  const tokenResponse: APIResponse = await request.post("auth", {
    data: tokenRequestBody,
  });

  const tokenApiResponseBody: TokenRes = await tokenResponse.json();
  const tokenNr: string = tokenApiResponseBody.token;
  console.log("Token Nr is: " + tokenNr);

  // Create PUT api call
  const putResponse: APIResponse = await request.put(`booking/${booking_id}`, {
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${tokenNr}`,
    },
    data: putBody,
  });

  const putResponseBody: APIResponse = await putResponse.json();
  console.log(putResponseBody);

  //Validate status code
  expect(putResponse.status()).toBe(200)
  expect(putResponse.ok()).toBeTruthy()
});
