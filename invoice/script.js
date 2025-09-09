const addItem = document.getElementById("addItem");

addItem.addEventListener("click", () => {
  let tableBody = document.getElementById("gstTable").querySelector("tbody");

  let newRow = document.createElement("tr");
  newRow.classList.add("dataRow");

  newRow.innerHTML = `
<td class="p-2">
    <input type="text" placeholder="Item name" class="rounded-lg border border-gray-300 p-2 itemName" >
</td>
<td class="p-2">
    <input type="number" placeholder="Qty" class="rounded-lg border border-gray-300 p-2 qty"  value="">
</td>
<td class="p-2">
    <input type="number" placeholder="Price" class="rounded-lg border border-gray-300 p-2 price" value="">
</td>
<td class="p-2">
    <select name="GST" class="gstPercent gst-select w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm cursor-pointer appearance-none" title="gst">
        <option value="0">GST 0%</option>
        <option value="5">GST 5%</option>
        <option value="12">GST 12%</option>
        <option value="18">GST 18%</option>
        <option value="28">GST 28%</option>
    </select>
</td>
<td class="p-2">
    <p class="amount">₹0.00</p>
</td>
<td></i>
    <button type="button" onclick="deleteRow(this)" title="button"><i
            class="fa-solid fa-trash text-red-500 cursor-pointer"></i></button>
</td>
`;
  tableBody.appendChild(newRow);
});

function deleteRow(button) {
  let row = button.closest("tr");
  row.remove();
  calculateTotals();
}

let qty = document.querySelector(".qty");
let price = document.querySelector(".price");

const container =
  document.querySelector("#gstTable tbody") ||
  document.querySelector("#gstTable");

container.addEventListener("input", onRowEdit);

function onRowEdit(e) {
  if (!e.target.matches(".qty, .price, .gstPercent")) return;
  let row = e.target.closest("tr");
  let qtyRaw = row.querySelector(".qty")?.value || "";
  let priceRaw = row.querySelector(".price")?.value || "";

  let qty = qtyRaw === "" ? 0 : Number(qtyRaw);
  let priceProvided = priceRaw !== "";
  let price = priceProvided ? Number(priceRaw) : 0;

  let amountText;

  // if (priceProvided) {
  let baseTotal = qty * price || 0;
  amountText = baseTotal.toFixed(2);
  // } else if (qty > 0) {
  //   amountText = qty.toString();
  // } else {
  //   amountText = "0.00";
  // }

  row.querySelector(".amount").innerText = `₹${amountText}`;

  calculateTotals();
}

function calculateTotals() {
  let rows = document.querySelectorAll("#gstTable tbody .dataRow");
  let subtotal = 0;
  let gstTotal = 0;

  rows.forEach((row) => {
    let qty = row.querySelector(".qty")?.value || 0;
    let price = row.querySelector(".price")?.value || 0;
    let gst = row.querySelector(".gstPercent")?.value || 0;

    let baseTotal = qty * price;
    let gstAmount = (baseTotal * +gst) / 100;

    subtotal += +baseTotal;
    gstTotal += +gstAmount;
  });

  let tfoot = document.getElementById("gstTable").querySelector("tfoot");
  tfoot.querySelector(".subtotal").innerText = `₹${subtotal.toFixed(2)}`;
  tfoot.querySelector(".gstTotal").innerText = `₹${gstTotal.toFixed(2)}`;
  tfoot.querySelector(".grandTotal").innerText = `₹${(
    subtotal + gstTotal
  ).toFixed(2)}`;
}

function validation(e) {
  // e.preventDefault();
  let form = document.querySelector("#invoiceForm");
  form.querySelectorAll(".error-msg").forEach((el) => el.remove());
  let userName = document.querySelector("#userName");
  let invoiceNumber = document.querySelector("#invoiceNumber");
  let invoiceDate = document.querySelector("#invoiceDate");

  let isValid = true;

  if (!userName.value.trim()) {
    showError(userName, "Please Enter Name");
    isValid = false;
  }
  if (!invoiceNumber.value.trim()) {
    showError(invoiceNumber, "Please Enter Invoice number");
    isValid = false;
  }
  if (!invoiceDate.value.trim()) {
    showError(invoiceDate, "Please Select Invoice date");
    isValid = false;
  }

  let rows = document.querySelectorAll("#gstTable tbody .dataRow");

  rows.forEach((row) => {
    let qtyEle = row.querySelector(".qty");
    let priceEle = row.querySelector(".price");
    let gstEle = row.querySelector(".gstPercent");
    let itemNameEle = row.querySelector(".itemName");
    let itemName = row.querySelector(".itemName")?.value || "";
    let qty = row.querySelector(".qty")?.value || 0;
    let price = row.querySelector(".price")?.value || 0;
    let gst = row.querySelector(".gstPercent")?.value || 0;

    if (!itemName) {
      showError(itemNameEle, "Please Enter Item Name");
      isValid = false;
    }
    if (qty === "" || Number(qty) <= 0) {
      showError(qtyEle, "Please enter quantity (minimum 1)");
      isValid = false;
    }
    if (price == "") {
      showError(priceEle, "Please Enter Price");
      isValid = false;
    }
  });

  return isValid;
}

function showError(inputElement, message) {
  let error = document.createElement("p");
  error.className = "error-msg text-red-500 text-sm mt-1";
  error.innerText = message;

  if (inputElement.tagName === "DIV") {
    inputElement.appendChild(error);
  } else {
    inputElement.parentElement.appendChild(error);
  }
}
document.querySelector("#invoiceForm").addEventListener("submit", validation);
let form = document.querySelector("#invoiceForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const ok = validation();

  console.log(ok);

  if (ok) {
    let user = {};
    let rowsData = [];

    document.querySelectorAll("#gstTable tbody tr").forEach((row) => {
      let itemName = row.querySelector(".itemName")?.value;
      let qty = row.querySelector(".qty")?.value;
      let price = row.querySelector(".price")?.value;
      let tax = row.querySelector(".gstPercent")?.value;
      let amount = row
        .querySelector(".amount")
        ?.innerText.replace(/[^0-9.]/g, "");

      rowsData.push({
        itemName: itemName,
        quantity: qty,
        price: price,
        tax: tax,
        amount: amount,
      });
    });

    let userName = document.querySelector("#userName")?.value;
    let invoiceNumber = document.querySelector("#invoiceNumber")?.value;
    let invoiceDate = document.querySelector("#invoiceDate")?.value;
    let subTotal = document
      .querySelector(".subtotal")
      .innerText.replace(/[^0-9.]/g, "");
    let gstTotal = document
      .querySelector(".gstTotal")
      .innerText.replace(/[^0-9.]/g, "");
    let total = document
      .querySelector(".grandTotal")
      .innerText.replace(/[^0-9.]/g, "");

    user = {
      name: userName,
      invoiceNumber: invoiceNumber,
      invoiceDate: invoiceDate,
      tableRows: rowsData,
      subTotal: subTotal,
      gstTotal: gstTotal,
      total: total,
    };

    localStorage.setItem("users", JSON.stringify(user));
    form.reset();

    let tbody = document.querySelector("#gstTable tbody");
    let rows = tbody.querySelectorAll("tr");

    rows.forEach((row, index) => {
      if (index === 0) {
        row.querySelector(".itemName").value = "";
        row.querySelector(".qty").value = "";
        row.querySelector(".price").value = "";
        row.querySelector(".gstPercent").value = "0";
        row.querySelector(".amount").innerText = "₹0.00";
      } else {
        row.remove();
      }
    });

    document.querySelector(".subtotal").innerText = "₹0.00";
    document.querySelector(".gstTotal").innerText = "₹0.00";
    document.querySelector(".grandTotal").innerText = "₹0.00";

    let header = document.querySelector("#header");
    let title = document.querySelector("#invoiceTitle");
    let icon = document.querySelector(".header-icon");

    header.classList.remove("bg-blue-600");
    header.classList.add("bg-[#0F7C3E]");

    let oldText = title.innerText;
    title.innerText = "Invoice Submitted Successfully...";
    icon.classList.remove("fa-plus-circle");
    icon.classList.add("fa-circle-check");
    setTimeout(() => {
      header.classList.remove("bg-green-600");
      header.classList.add("bg-blue-600");
      icon.classList.remove("fa-circle-check");
      icon.classList.add("fa-plus-circle");
      title.innerText = oldText;
    }, 4000);
  } else {
    let header = document.querySelector("#header");
    let title = document.querySelector("#invoiceTitle");
    let icon = document.querySelector(".header-icon");

    header.classList.remove("bg-blue-600");
    header.classList.add("bg-red-600");

    let oldText = title.innerText;
    title.innerText =
      "Form submission failed please check the highlighted fields";
    icon.classList.remove("fa-plus-circle");
    icon.classList.add("fa-circle-exclamation");
    setTimeout(() => {
      header.classList.remove("bg-red-600");
      header.classList.add("bg-blue-600");
      icon.classList.remove("fa-circle-exclamation");
      icon.classList.add("fa-plus-circle");
      title.innerText = oldText;
    }, 4000);
  }
});

document.querySelector("#invoiceForm").addEventListener("input", (e) => {
  if (
    e.target.classList.contains("itemName") ||
    e.target.classList.contains("qty") ||
    e.target.classList.contains("price") ||
    e.target.id === "userName" ||
    e.target.id === "invoiceNumber" ||
    e.target.id === "invoiceDate"
  ) {
    let error = e.target.parentElement.querySelector(".error-msg");
    if (error) error.remove();
  }
});

document.querySelector("#invoiceForm").addEventListener("change", (e) => {
  if (e.target.classList.contains("gstPercent")) {
    let error = e.target.parentElement.querySelector(".error-msg");
    if (error) error.remove();
  }
});
