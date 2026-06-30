const BASE_URL = "https://gymshim.in";

const toApiDate = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};


export const assignMembershipFromKiosk = async (
  form,
  selectedPlans,
  payableAmount,
  mode = "upi"
) => {
  const today = toApiDate();

  const body = {
    userInfo: {
      phone: form.phone,
      name: form.name,
    
    },
    membershipPlanId: selectedPlans[0]?.id || "",
    amount: Number(payableAmount),
    date: today,
    invoiceDate: today,
    paymentDate: today,
    mode,
    source: "kiosk",
  };

  const response = await fetch(`${BASE_URL}/api/assign-membership-from-sales-kiosk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.log("Server error response:", data);
    throw new Error(data?.message || `Request failed with status ${response.status}`);
  }

  return data.membership;
};