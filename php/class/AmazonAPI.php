<?php

// Provides a wrapper class for querying the Amazon API.
class AmazonAPI
{
    // These must not be revealed to the public.
    private $secret_key = "QGyKTBEQ+lSRDq5Y85/iXiDsdPeDNhheUgvzd/yC";
    private $associate_id = "AKIAIWOOKWTFLM77SRKA";
    private $associate_tag = "austdisc-20";

    public function queryAmazon($url)
    {
        return file_get_contents($this->signAmazonUrl($url));
    }

    function signAmazonUrl($url)
    {
        $url = $url . "&SubscriptionId=" . $this->associate_id
                . "&AssociateTag=" . $this->associate_tag;

        $original_url = $url;

        // Decode anything already encoded.
        $url = urldecode($url);

        // Parse the URL into $urlparts.
        $urlparts = parse_url($url);

        // Build $params with each name/value pair.
        foreach (explode('&', $urlparts['query']) as $part) {
            if (strpos($part, '=')) {
                list($name, $value) = explode('=', $part, 2);
            } else {
                $name = $part;
                $value = '';
            }
            $params[$name] = $value;
        }

        // Include a timestamp if none was provided.
        if (empty($params['Timestamp'])) {
            $params['Timestamp'] = gmdate('Y-m-d\TH:i:s\Z');
        }

        // Add access key.
        $params['AWSAccessKeyId'] = $this->associate_id;

        // Sort the array by key.
        ksort($params);

        // Build the canonical query string.
        $canonical = '';
        foreach ($params as $key => $val) {
            $canonical .= "$key=" . rawurlencode(utf8_encode($val)) . "&";
        }

        // Remove the trailing ampersand.
        $canonical = preg_replace("/&$/", '', $canonical);

        // Some common replacements and ones that Amazon specifically mentions.
        $canonical = str_replace(array(' ', '+', ',', ';'), array('%20', '%20', urlencode(','), urlencode(':')), $canonical);

        // Build the sign.
        $string_to_sign = "GET\n{$urlparts['host']}\n{$urlparts['path']}\n$canonical";

        // Calculate our actual signature and base64 encode it.
        $signature = base64_encode(hash_hmac('sha256', $string_to_sign, $this->secret_key, true));

        // Finally re-build the URL with the proper string and include the
        // Signature.
        $url = "{$urlparts['scheme']}://{$urlparts['host']}{$urlparts['path']}?$canonical&Signature=" . rawurlencode($signature);

        return $url;
    }
}