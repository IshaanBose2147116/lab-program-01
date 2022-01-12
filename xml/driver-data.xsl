<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
    <html>
        <head>
            <link href="../styles/dashboard_common.css" rel="stylesheet" />
            <link rel="stylesheet" href="../styles/driver_dashboard.css" />
        </head>
        <body>
            <div class="content-container">
                <div class="user-details-container">
                    <div class="emp-img-container">
                        <img src="../assests/images/blank-profile-picture.png" />
                    </div>
                    <div class="user-details">
                        <span>Employee ID:</span><span id="empid">
                            <xsl:value-of select="drivers/driver/@emp-id" />
                        </span><br/>
                        <span>Currently Assigned:</span><span id="vehicle-id">
                            <xsl:value-of select="drivers/driver/vehicle-assigned" />
                        </span>
                    </div>
                </div>
                <div class="database-details-container" style="padding: 3em 1em;">
                    <xsl:apply-templates select="drivers/driver/route" />
                </div>
            </div>
        </body>
    </html>
</xsl:template>

<xsl:template match="/drivers/driver/route">
    <b>Route Start: </b><xsl:value-of select="route-start" /><br/>
    <b>Route End: </b><xsl:value-of select="route-end" /><br/><br/>
    <b>Scheduled Start Time: </b> <xsl:value-of select="sched-start" /><br/>
    <b>Scheduled End Time: </b> <xsl:value-of select="sched-end" />
    <div class="table-container">
        <table class="dropoffs-table">
            <tr>
                <th>Drop Off Address</th>
                <th>No. of Drop Offs</th>
            </tr>
            <xsl:for-each select="drop-offs/drop-off">
            <xsl:sort select="address" />
                <tr>
                    <xsl:choose>
                        <xsl:when test="no-drop-offs >= 3">
                            <td style="background-color: rgba(255, 0, 0, 0.2);"><xsl:value-of select="address" /></td>
                            <td style="background-color: rgba(255, 0, 0, 0.2);"><xsl:value-of select="no-drop-offs" /></td>
                        </xsl:when>
                        <xsl:otherwise>
                            <td><xsl:value-of select="address" /></td>
                            <td><xsl:value-of select="no-drop-offs" /></td>
                        </xsl:otherwise>
                    </xsl:choose>
                </tr>
            </xsl:for-each>
        </table>
    </div>
</xsl:template>
</xsl:stylesheet>