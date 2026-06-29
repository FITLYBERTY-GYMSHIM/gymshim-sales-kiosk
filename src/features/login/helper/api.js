const BASE_URL = "http://localhost:3005";

export const createMembership = async (form, selectedPlans) => {
  const body = {
    userInfo: {
      name:             form.name,
      phone:            form.phone,
      phoneCountryCode: "91",
    },
    birthDate:        form.birthDate,
    maritalStatus:    form.maritalStatus,
    anniversaryDate:  form.anniversaryDate,
    gender:           form.gender,
    gstin:            form.gstin,
    plan_id:          selectedPlans[0]?.id       || null,
    duration:         selectedPlans[0]?.duration || "",
    total:            String(selectedPlans.reduce((s, p) => s + p.price, 0)),
    plans: selectedPlans.map((p) => ({
            id:p.id,
            label:p.label,
            duration: p.duration,
            price:p.price,
          })),


    billedInfo: {
      payableAmount: String(selectedPlans.reduce((s, p) => s + p.price, 0)),
    },

    currency:         "INR",
    currency_sign:    "₹",
    status:           "active",
    state:            "ACTIVE",
    sale_type:        "FRESH_SALE",
    is_active:        true,
    draft:            false,
    starts_at:        new Date().toISOString(),
    starts_at_string: new Date().toDateString(),
    createdAt:        new Date().toISOString(),
  };

  const response = await fetch(`${BASE_URL}/memberships`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Membership creation failed: ${errText}`);
  }

  return response.json();
};

export const createPayment = async (membershipId, payableAmount) => {
  const body = {
    membershipId:      membershipId,
    amount:            String(payableAmount),
    status:            "SUCCESS",
    mode:              "UPI",
    source:            "APP",
    draft:             false,
    invoiceDate:       new Date().toISOString(),
    invoiceDateString: new Date().toDateString(),
    paymentDate:       new Date().toISOString(),
    paymentDateString: new Date().toDateString(),
    createdAt:         new Date().toISOString(),
  };

  const response = await fetch(`${BASE_URL}/payments`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Payment creation failed: ${errText}`);
  }

  return response.json();
};