package com.bestmealmate.app;

import android.os.Bundle;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import com.amazon.device.iap.PurchasingListener;
import com.amazon.device.iap.PurchasingService;
import com.amazon.device.iap.model.FulfillmentResult;
import com.amazon.device.iap.model.Product;
import com.amazon.device.iap.model.ProductDataResponse;
import com.amazon.device.iap.model.PurchaseResponse;
import com.amazon.device.iap.model.PurchaseUpdatesResponse;
import com.amazon.device.iap.model.Receipt;
import com.amazon.device.iap.model.UserDataResponse;

import com.getcapacitor.BridgeActivity;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "BestMealMate";
    private static final String SKU_PREMIUM = "com.bestmealmate.premium_monthly";
    private static final String SKU_FAMILY = "com.bestmealmate.family_monthly";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Initialize Amazon IAP
        setupAmazonIAP();
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Check for pending purchases when app resumes
        PurchasingService.getPurchaseUpdates(true);
    }

    private void setupAmazonIAP() {
        PurchasingService.registerListener(this, new PurchasingListener() {
            @Override
            public void onUserDataResponse(UserDataResponse response) {
                switch (response.getRequestStatus()) {
                    case SUCCESSFUL:
                        String currentUserId = response.getUserData().getUserId();
                        String marketplace = response.getUserData().getMarketplace();
                        Log.d(TAG, "User ID: " + currentUserId + ", Marketplace: " + marketplace);
                        break;
                    case FAILED:
                    case NOT_SUPPORTED:
                        Log.e(TAG, "Failed to get user data");
                        break;
                }
            }

            @Override
            public void onProductDataResponse(ProductDataResponse response) {
                switch (response.getRequestStatus()) {
                    case SUCCESSFUL:
                        Map<String, Product> products = response.getProductData();
                        for (String key : products.keySet()) {
                            Product product = products.get(key);
                            Log.d(TAG, "Product: " + product.getTitle() + " - " + product.getPrice());
                        }
                        // Notify web app about available products
                        notifyWebApp("onProductsLoaded", productsToJson(products));
                        break;
                    case FAILED:
                    case NOT_SUPPORTED:
                        Log.e(TAG, "Failed to get product data");
                        notifyWebApp("onProductsError", "{}");
                        break;
                }
            }

            @Override
            public void onPurchaseResponse(PurchaseResponse response) {
                switch (response.getRequestStatus()) {
                    case SUCCESSFUL:
                        Receipt receipt = response.getReceipt();
                        handlePurchase(receipt);
                        break;
                    case ALREADY_PURCHASED:
                        Log.d(TAG, "Already purchased");
                        notifyWebApp("onPurchaseAlreadyOwned", "{}");
                        break;
                    case INVALID_SKU:
                        Log.e(TAG, "Invalid SKU");
                        notifyWebApp("onPurchaseError", "{\"error\": \"Invalid SKU\"}");
                        break;
                    case FAILED:
                    case NOT_SUPPORTED:
                        Log.e(TAG, "Purchase failed");
                        notifyWebApp("onPurchaseError", "{\"error\": \"Purchase failed\"}");
                        break;
                }
            }

            @Override
            public void onPurchaseUpdatesResponse(PurchaseUpdatesResponse response) {
                switch (response.getRequestStatus()) {
                    case SUCCESSFUL:
                        for (Receipt receipt : response.getReceipts()) {
                            handlePurchase(receipt);
                        }
                        if (response.hasMore()) {
                            PurchasingService.getPurchaseUpdates(false);
                        }
                        break;
                    case FAILED:
                    case NOT_SUPPORTED:
                        Log.e(TAG, "Failed to get purchase updates");
                        break;
                }
            }
        });

        // Get user data
        PurchasingService.getUserData();

        // Get product data for our SKUs
        Set<String> productSkus = new HashSet<>();
        productSkus.add(SKU_PREMIUM);
        productSkus.add(SKU_FAMILY);
        PurchasingService.getProductData(productSkus);
    }

    private void handlePurchase(Receipt receipt) {
        String sku = receipt.getSku();
        String receiptId = receipt.getReceiptId();
        boolean isCanceled = receipt.isCanceled();

        Log.d(TAG, "Purchase: SKU=" + sku + ", ReceiptID=" + receiptId + ", Canceled=" + isCanceled);

        if (!isCanceled) {
            // Fulfill the purchase
            PurchasingService.notifyFulfillment(receiptId, FulfillmentResult.FULFILLED);

            // Notify web app about successful purchase
            String planType = sku.contains("family") ? "family" : "premium";
            notifyWebApp("onPurchaseSuccess", "{\"plan\": \"" + planType + "\", \"receiptId\": \"" + receiptId + "\"}");
        } else {
            notifyWebApp("onSubscriptionCanceled", "{\"sku\": \"" + sku + "\"}");
        }
    }

    private String productsToJson(Map<String, Product> products) {
        StringBuilder json = new StringBuilder("{\"products\": [");
        boolean first = true;
        for (Product product : products.values()) {
            if (!first) json.append(",");
            json.append("{");
            json.append("\"sku\": \"").append(product.getSku()).append("\",");
            json.append("\"title\": \"").append(product.getTitle()).append("\",");
            json.append("\"description\": \"").append(product.getDescription()).append("\",");
            json.append("\"price\": \"").append(product.getPrice()).append("\"");
            json.append("}");
            first = false;
        }
        json.append("]}");
        return json.toString();
    }

    private void notifyWebApp(String event, String data) {
        runOnUiThread(() -> {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                String js = "window.dispatchEvent(new CustomEvent('" + event + "', { detail: " + data + " }));";
                webView.evaluateJavascript(js, null);
            }
        });
    }

    // JavaScript Interface for purchasing from web app
    public class AmazonIAPInterface {
        @JavascriptInterface
        public void purchasePremium() {
            PurchasingService.purchase(SKU_PREMIUM);
        }

        @JavascriptInterface
        public void purchaseFamily() {
            PurchasingService.purchase(SKU_FAMILY);
        }

        @JavascriptInterface
        public void refreshPurchases() {
            PurchasingService.getPurchaseUpdates(true);
        }

        @JavascriptInterface
        public boolean isAmazonDevice() {
            return true;
        }
    }

    @Override
    public void onStart() {
        super.onStart();
        // Add JavaScript interface for IAP
        WebView webView = getBridge().getWebView();
        if (webView != null) {
            webView.addJavascriptInterface(new AmazonIAPInterface(), "AmazonIAP");
        }
    }
}
