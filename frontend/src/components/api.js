export async function sendRequest({
  route,
  method = "GET",
  body = null,
  headers = {},
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER;

  const options = {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${baseUrl}${route}`, options);

  if (!res.ok) {
    const errorMessage = await res.text();
    throw new Error(`Request failed: ${res.status} - ${errorMessage}`);
  }

  return res.json();
}
